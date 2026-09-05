"use strict";

const agentService = require("../services/agent.service");

const getDashboard = async (req, res, next) => {
  try {
    const stats = await agentService.getDashboardStats(req.user.id);

    res.status(200).json({
      success: true,
      message: "Agent dashboard statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};