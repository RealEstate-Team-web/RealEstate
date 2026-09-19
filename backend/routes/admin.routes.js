const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { validateIdParam } = require("../middlewares/validation.middleware");
const {
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
} = require("../controllers/admin.controller");
const {
  list,
  getOne,
  create,
  update,
  remove,
} = require("../controllers/category.controller");
const {
  list: listPlans,
  getOne: getPlan,
  create: createPlan,
  update: updatePlan,
  updateStatus,
  remove: removePlan,
} = require("../controllers/subscriptionPlan.controller");
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCreateSubscriptionPlan,
  validateUpdateSubscriptionPlan,
  validateSubscriptionPlanStatus,
} = require("../middlewares/validation.middleware");

const router = express.Router();

router.use(authenticate, requireRole("admin"));

router.get("/", getDashboard);
router.get("/search", searchEntities);
router.get("/analytics", getAnalytics);
router.get("/reports", getReports);
router.get("/agents", getAgents);
router.patch("/agents/:id/approve", approveAgent);
router.patch("/agents/:id/reject", rejectAgent);
router.patch("/agents/:id/suspend", suspendAgent);

router.get("/users", listUsers);
router.patch("/users/:id/suspend", suspendUser);
router.patch("/users/:id/activate", activateUser);

router.get("/categories", list);
router.get("/categories/:id", getOne);
router.post("/categories", validateCreateCategory, create);
router.put("/categories/:id", validateUpdateCategory, update);
router.delete("/categories/:id", remove);

router.get("/subscription-plans", listPlans);
router.get("/subscription-plans/:id", validateIdParam, getPlan);
router.post("/subscription-plans", validateCreateSubscriptionPlan, createPlan);
router.put("/subscription-plans/:id", validateIdParam, validateUpdateSubscriptionPlan, updatePlan);
router.patch("/subscription-plans/:id/status", validateIdParam, validateSubscriptionPlanStatus, updateStatus);
router.delete("/subscription-plans/:id", validateIdParam, removePlan);

module.exports = router;
