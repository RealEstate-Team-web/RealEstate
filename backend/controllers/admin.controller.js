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

const getAnalytics = async (req, res, next) => {
  try {
    const { range } = req.query;
    const data = await adminService.getAnalytics({ range });
    res.status(200).json({
      success: true,
      message: "Platform analytics",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getReports = async (req, res, next) => {
  try {
    const { range } = req.query;
    const data = await adminService.getAnalytics({ range });
    res.status(200).json({
      success: true,
      message: "Platform reports",
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

const listUsers = async (req, res, next) => {
  try {
    const { role, status, page, limit } = req.query;
    const result = await adminService.listUsers({ role, status, page, limit });
    res.status(200).json({
      success: true,
      message: "User list",
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      stats: {
        active: result.active,
        suspended: result.suspended,
        admins: result.admins,
      },
    });
  } catch (error) {
    next(error);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const data = await adminService.suspendUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "User suspended",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const data = await adminService.activateUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "User activated",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const searchEntities = async (req, res, next) => {
  try {
    const { q } = req.query;
    const data = await adminService.searchEntities(q);
    res.status(200).json({
      success: true,
      message: "Search results",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAnalytics,
  getReports,
  searchEntities,
  getAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
  listUsers,
  suspendUser,
  activateUser,
};
