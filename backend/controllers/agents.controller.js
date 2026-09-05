const agentModel = require("../models/agent.model");

const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 50;

const normalizeLimit = (raw) => {
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
};

// GET /api/agents — public list of approved agents
const getPublicAgents = async (req, res, next) => {
  try {
    const limit = normalizeLimit(req.query.limit);

    const rows = await agentModel.listApprovedAgents(limit);

    const agents = rows.map((agent) => {
      const name = `${agent.first_name || ""} ${agent.last_name || ""}`.trim();

      return {
        id: agent.userId,
        name: name || agent.email,
        role:
          agent.specialization ||
          agent.agency ||
          "Real Estate Agent",
        agency: agent.agency,
        location: agent.city || "",
        phone: agent.phone,
        email: agent.email,
        photo: agent.photo,
        experienceYears: agent.experienceYears,
        propertyCount: Number(agent.propertyCount) || 0,
      };
    });

    res.status(200).json({
      success: true,
      message: "Agents fetched successfully",
      data: {
        agents,
        total: agents.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicAgents,
};