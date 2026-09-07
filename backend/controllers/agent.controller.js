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

const getProfile = async (req, res, next) => {
  try {
    const data = await agentService.getAgentProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Agent profile retrieved",
      data: { profile: data },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await agentService.updateAgentProfile(req.user.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      agencyName: req.body.agencyName,
      specialization: req.body.specialization,
      officeAddress: req.body.officeAddress,
      city: req.body.city,
      bio: req.body.bio,
    });

    res.status(200).json({
      success: true,
      message: "Agent profile updated",
      data: { profile: data },
    });
  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const data = await agentService.getAnalytics(req.user.id);

    res.status(200).json({
      success: true,
      message: "Agent analytics fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getAnalytics,
};