const agentModel = require("../models/agent.model");

// GET /api/agents — public list of approved agents
const getPublicAgents = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 30;

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