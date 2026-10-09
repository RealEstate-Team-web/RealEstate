const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { validateCheckout } = require("../middlewares/validation.middleware");
const {
  checkout,
  getCurrent,
} = require("../controllers/subscription.controller");

const router = express.Router();

// POST /api/subscriptions/checkout - start Chapa checkout for a plan
router.post(
  "/checkout",
  authenticate,
  requireRole("agent"),
  validateCheckout,
  checkout
);

// GET /api/subscriptions/current - the agent's current subscription state
router.get("/current", authenticate, requireRole("agent"), getCurrent);

module.exports = router;