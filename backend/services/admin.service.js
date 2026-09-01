const Agent = require("../models/agent.model");
const User = require("../models/user.model");
const Property = require("../models/property.model");
const Visit = require("../models/visit.model");
const { sendSuspensionEmail, sendActivationEmail } = require("../services/email.service");

function normalizeRange(range) {
  if (range === undefined || range === null) return 30;
  const value = Number(range);
  if (!Number.isInteger(value) || value <= 0) {
    const error = new Error("Invalid range parameter");
    error.status = 400;
    throw error;
  }
  return Math.min(value, 365);
}

function toDateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildTrendSeries(rows, days) {
  const counts = new Map();
  rows.forEach((row) => counts.set(row.date, Number(row.count)));

  const series = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = toDateKey(d);
    series.push({ date: key, count: counts.get(key) || 0 });
  }
  return series;
}

function mapStatusToMeta(status) {
  const meta = {
    available: { label: "Available", color: "#4FAF83" },
    sold: { label: "Sold", color: "#D96B67" },
    rented: { label: "Rented", color: "#4A9FF5" },
    pending: { label: "Pending", color: "#E7B85A" },
    approved: { label: "Approved", color: "#4FAF83" },
    cancelled: { label: "Cancelled", color: "#D96B67" },
    completed: { label: "Completed", color: "#4A9FF5" },
  };
  return (
    meta[status] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      color: "#9CA3AF",
    }
  );
}

function statusBreakdown(byStatusRows) {
  const counts = { pending: 0, approved: 0, rejected: 0 };
  byStatusRows.forEach((row) => {
    if (row.verification_status in counts) {
      counts[row.verification_status] = Number(row.count);
    }
  });

  return [
    { label: "Pending", value: counts.pending, color: "#E7B85A" },
    { label: "Approved", value: counts.approved, color: "#4FAF83" },
    { label: "Rejected", value: counts.rejected, color: "#D96B67" },
  ];
}

async function getDashboardStats() {
  const [usersTotal] = await Agent.countUsers();
  const [agentsTotal] = await Agent.countAgents();
  const byStatusRows = await Agent.countByVerificationStatus();
  const [suspended] = await Agent.countSuspendedUsers();
  const recentAgents = await Agent.recentAgents(5);

  const pending = byStatusRows.find((r) => r.verification_status === "pending");
  const approved = byStatusRows.find((r) => r.verification_status === "approved");
  const rejected = byStatusRows.find((r) => r.verification_status === "rejected");

  return {
    totalUsers: Number(usersTotal.count),
    totalAgents: Number(agentsTotal.count),
    pendingAgents: pending ? Number(pending.count) : 0,
    approvedAgents: approved ? Number(approved.count) : 0,
    rejectedAgents: rejected ? Number(rejected.count) : 0,
    suspendedUsers: Number(suspended.count),
    recentAgents,
    statusBreakdown: statusBreakdown(byStatusRows),
  };
}

async function getAnalytics({ range } = {}) {
  const days = normalizeRange(range);

  const [usersTotal] = await Agent.countUsers();
  const [agentsTotal] = await Agent.countAgents();
  const roleCounts = await User.countByRole();
  const propByStatus = await Property.countByStatus();
  const propByCategory = await Property.countByCategory();
  const visitByStatus = await Visit.countByStatus();
  const registrations = await User.countRegistrationsByDay(days);
  const checkins = await Visit.countByDay(days);

  const countOf = (rows, key, value) => {
    const found = rows.find((r) => r[key] === value);
    return found ? Number(found.count) : 0;
  };

  const totalProperties = await Property.countProperties().catch(() => 0);
  const totalVisits = await Visit.countVisits().catch(() => 0);

  const roleCountMap = new Map(roleCounts.map((r) => [r.role, Number(r.count)]));

  const categoryRows = propByCategory.map((row) => {
    const totalCats = propByCategory.reduce((sum, r) => sum + Number(r.count), 0) || 1;
    return {
      id: row.id,
      name: row.name,
      count: Number(row.count),
      pct: Math.round((Number(row.count) / totalCats) * 100),
    };
  });

  return {
    kpis: {
      users: Number(usersTotal.count),
      agents: Number(agentsTotal.count),
      buyers: roleCountMap.get("buyer") || 0,
      properties: totalProperties,
      availableProperties: countOf(propByStatus, "status", "available"),
      visits: totalVisits,
      pendingVisits: countOf(visitByStatus, "status", "pending"),
      approvedVisits: countOf(visitByStatus, "status", "approved"),
      completedVisits: countOf(visitByStatus, "status", "completed"),
      cancelledVisits: countOf(visitByStatus, "status", "cancelled"),
    },
    registrationsTrend: buildTrendSeries(registrations, days),
    checkinsTrend: buildTrendSeries(checkins, days),
    items: propByCategory.map((row) => ({
      id: row.id,
      name: row.name,
      status: "active",
      count: Number(row.count),
    })),
    categories: categoryRows,
    visitStatusBreakdown: visitByStatus.map((row) => ({
      label: mapStatusToMeta(row.status).label,
      value: Number(row.count),
      color: mapStatusToMeta(row.status).color,
    })),
  };
}

async function listAgents({ status } = {}) {
  return Agent.listAgents({ status });
}

async function approveAgent(id) {
  const agent = await Agent.findById(id);
  if (!agent) {
    const error = new Error("Agent not found");
    error.status = 404;
    throw error;
  }
  const affected = await Agent.setVerificationStatus(id, "approved");
  if (affected === 0) {
    const error = new Error("Agent is not pending approval");
    error.status = 409;
    throw error;
  }
  return { id: agent.id, status: "approved" };
}

async function rejectAgent(id) {
  const agent = await Agent.findById(id);
  if (!agent) {
    const error = new Error("Agent not found");
    error.status = 404;
    throw error;
  }
  const affected = await Agent.setVerificationStatus(id, "rejected");
  if (affected === 0) {
    const error = new Error("Agent is not pending approval");
    error.status = 409;
    throw error;
  }
  return { id: agent.id, status: "rejected" };
}

async function suspendAgent(id) {
  const agent = await Agent.findById(id);
  if (!agent) {
    const error = new Error("Agent not found");
    error.status = 404;
    throw error;
  }
  await Agent.setUserStatus(agent.userId, "suspended");
  return { id: agent.id, userStatus: "suspended" };
}

function validatePagination(page, limit) {
  const safeInt = (value, fallback) => {
    if (value === undefined || value === null) return fallback;
    const n = Number(value);
    if (!Number.isInteger(n) || n <= 0) {
      const error = new Error("Invalid page or limit parameter");
      error.status = 400;
      throw error;
    }
    return n;
  };
  const p = safeInt(page, 1);
  const l = safeInt(limit, 10);
  const clampedLimit = Math.min(l, 100);
  return { page: p, limit: clampedLimit };
}

function validateId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    const error = new Error("Invalid user id");
    error.status = 400;
    throw error;
  }
  return n;
}

async function listUsers({ role, status, page, limit } = {}) {
  if (role !== undefined && !["buyer", "agent", "admin"].includes(role)) {
    const error = new Error("Invalid role filter");
    error.status = 400;
    throw error;
  }
  if (status !== undefined && !["active", "suspended"].includes(status)) {
    const error = new Error("Invalid status filter");
    error.status = 400;
    throw error;
  }
  const paginated = validatePagination(page, limit);
  return User.listUsers({ role, status, page: paginated.page, limit: paginated.limit });
}

async function suspendUser(id) {
  const userId = validateId(id);
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  if (user.role === "admin") {
    const error = new Error("Cannot suspend an admin account");
    error.status = 403;
    throw error;
  }
  const affected = await User.setStatus(id, "suspended");
  if (affected === 1 && user.email) {
    sendSuspensionEmail(user.email).catch((err) =>
      console.error(
        "[admin.service] Suspension email dispatch failed: " + err.message
      )
    );
  }
  return { id: user.id, status: "suspended" };
}

async function activateUser(id) {
  const userId = validateId(id);
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
  const affected = await User.setStatus(id, "active");
  if (affected === 1 && user.email) {
    sendActivationEmail(user.email).catch((err) =>
      console.error(
        "[admin.service] Activation email dispatch failed: " + err.message
      )
    );
  }
  return { id: user.id, status: "active" };
}

module.exports = {
  getDashboardStats,
  getAnalytics,
  listAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
  listUsers,
  suspendUser,
  activateUser,
};
