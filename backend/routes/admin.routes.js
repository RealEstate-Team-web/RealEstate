const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
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
  validateCreateCategory,
  validateUpdateCategory,
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

module.exports = router;
