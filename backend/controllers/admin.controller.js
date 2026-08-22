const adminService = require("../services/admin.service");

const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardStats();
    res.status(200).json({
      success: true,
      message: "Admin dashboard overview",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAgents = async (req, res, next) => {
  try {
    const { status } = req.query;
    const data = await adminService.listAgents({ status });
    res.status(200).json({
      success: true,
      message: "Agent list",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const approveAgent = async (req, res, next) => {
  try {
    const data = await adminService.approveAgent(req.params.id);
    res.status(200).json({
      success: true,
      message: "Agent approved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const rejectAgent = async (req, res, next) => {
  try {
    const data = await adminService.rejectAgent(req.params.id);
    res.status(200).json({
      success: true,
      message: "Agent rejected",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const suspendAgent = async (req, res, next) => {
  try {
    const data = await adminService.suspendAgent(req.params.id);
    res.status(200).json({
      success: true,
      message: "Agent suspended",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
};
