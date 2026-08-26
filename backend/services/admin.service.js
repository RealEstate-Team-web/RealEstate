const Agent = require("../models/agent.model");
const User = require("../models/user.model");
const { sendSuspensionEmail, sendActivationEmail } = require("../services/email.service");

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

async function listUsers({ role, status, page, limit } = {}) {
  const paginated = validatePagination(page, limit);
  return User.listUsers({ role, status, page: paginated.page, limit: paginated.limit });
}

async function suspendUser(id) {
  const user = await User.findById(id);
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
  const user = await User.findById(id);
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
  listAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
  listUsers,
  suspendUser,
  activateUser,
};
