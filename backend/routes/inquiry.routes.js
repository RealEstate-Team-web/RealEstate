const express = require("express");
const inquiryController = require("../controllers/inquiry.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  validateSubmitInquiry,
  validateInquiryMessage,
  validateInquiryIdParam,
} = require("../middlewares/validation.middleware");

const router = express.Router();

// Buyer Inquiries endpoints (Buyer role required)
router.post(
  "/",
  authenticate,
  requireRole("buyer"),
  validateSubmitInquiry,
  inquiryController.submitInquiry
);

router.get(
  "/",
  authenticate,
  requireRole("buyer"),
  inquiryController.getBuyerInquiries
);

// Agent Inquiries endpoints (Agent role required)
router.get(
  "/agent/received",
  authenticate,
  requireRole("agent"),
  inquiryController.getAgentInquiries
);

// Participant Thread endpoints (Buyer or Agent)
router.get(
  "/:id",
  authenticate,
  validateInquiryIdParam,
  inquiryController.getInquiryById
);

// Thread messages: Send reply message in existing inquiry thread (Buyer or Agent)
router.post(
  "/:id/messages",
  authenticate,
  validateInquiryIdParam,
  validateInquiryMessage,
  inquiryController.replyToInquiry
);

router.patch(
  "/:id/read",
  authenticate,
  requireRole("agent"),
  validateInquiryIdParam,
  inquiryController.markInquiryRead
);

module.exports = router;
