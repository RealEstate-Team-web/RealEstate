const express = require("express");
const inquiryController = require("../controllers/inquiry.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  validateSubmitInquiry,
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

router.get(
  "/:id",
  authenticate,
  requireRole("buyer"),
  validateInquiryIdParam,
  inquiryController.getBuyerInquiryById
);

// Thread messages: Send reply message in existing inquiry thread (Buyer or Agent)
router.post(
  "/:id/messages",
  authenticate,
  validateInquiryIdParam,
  inquiryController.replyToInquiry
);

// Agent Inquiries endpoints (Agent role required)
router.get(
  "/agent/received",
  authenticate,
  requireRole("agent"),
  inquiryController.getAgentInquiries
);

router.patch(
  "/:id/read",
  authenticate,
  requireRole("agent"),
  validateInquiryIdParam,
  inquiryController.markInquiryRead
);

module.exports = router;
