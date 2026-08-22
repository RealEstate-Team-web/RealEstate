const Agent = require("../models/agent.model");

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

module.exports = {
  getDashboardStats,
  listAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
};
