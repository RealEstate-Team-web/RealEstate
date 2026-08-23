const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  getDashboard,
  getAgents,
  approveAgent,
  rejectAgent,
  suspendAgent,
} = require("../controllers/admin.controller");

const router = express.Router();

router.use(authenticate, requireRole("admin"));

router.get("/", getDashboard);
router.get("/agents", getAgents);
router.patch("/agents/:id/approve", approveAgent);
router.patch("/agents/:id/reject", rejectAgent);
router.patch("/agents/:id/suspend", suspendAgent);

module.exports = router;
