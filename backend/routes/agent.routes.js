const express = require("express");
const inquiryController = require("../controllers/inquiry.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

const router = express.Router();

// GET /api/agent/inquiries - Get all inquiries received for the agent's properties
router.get(
  "/inquiries",
  authenticate,
  requireRole("agent"),
  inquiryController.getAgentInquiries
);

module.exports = router;
