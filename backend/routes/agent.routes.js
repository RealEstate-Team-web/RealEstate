const express = require("express");
const agentController = require("../controllers/agent.controller");
const inquiryController = require("../controllers/inquiry.controller");
const visitController = require("../controllers/visit.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  validateVisitIdParam,
  validateUpdateAgentProfile,
} = require("../middlewares/validation.middleware");

const router = express.Router();

// GET /api/agent/dashboard - Agent dashboard KPIs
router.get(
  "/dashboard",
  authenticate,
  requireRole("agent"),
  agentController.getDashboard
);

// GET /api/agent/profile - Get the authenticated agent's profile
router.get(
  "/profile",
  authenticate,
  requireRole("agent"),
  agentController.getProfile
);

// PUT /api/agent/profile - Update the authenticated agent's profile
router.put(
  "/profile",
  authenticate,
  requireRole("agent"),
  validateUpdateAgentProfile,
  agentController.updateProfile
);

// GET /api/agent/analytics - Agent analytics summary
router.get(
  "/analytics",
  authenticate,
  requireRole("agent"),
  agentController.getAnalytics
);

// GET /api/agent/inquiries - Get all inquiries received for the agent's properties
router.get(
  "/inquiries",
  authenticate,
  requireRole("agent"),
  inquiryController.getAgentInquiries
);

// GET /api/agent/visit-requests - Get visit requests for the agent's properties
router.get(
  "/visit-requests",
  authenticate,
  requireRole("agent"),
  visitController.getAgentVisitRequests
);

// PATCH /api/agent/visits/:id/approve - Approve a pending visit request
router.patch(
  "/visits/:id/approve",
  authenticate,
  requireRole("agent"),
  validateVisitIdParam,
  visitController.approveVisit
);

// PATCH /api/agent/visits/:id/reject - Reject a pending visit request
router.patch(
  "/visits/:id/reject",
  authenticate,
  requireRole("agent"),
  validateVisitIdParam,
  visitController.rejectVisit
);

module.exports = router;
