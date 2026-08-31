const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const {
  bookVisit,
  getBuyerVisits,
  cancelVisit,
  rescheduleVisit,
} = require("../controllers/visit.controller");
const {
  validateBookVisit,
  validateVisitIdParam,
  validateRescheduleVisit,
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticate, requireRole("buyer"));

router.get("/", getBuyerVisits);
router.post("/", validateBookVisit, bookVisit);
router.patch("/:id/cancel", validateVisitIdParam, cancelVisit);
router.patch("/:id/reschedule", validateVisitIdParam, validateRescheduleVisit, rescheduleVisit);

module.exports = router;
