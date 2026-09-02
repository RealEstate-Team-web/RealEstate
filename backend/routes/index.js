const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const categoryRoutes = require("./category.routes");
const propertyRoutes = require("./property.routes");
const favoriteRoutes = require("./favorite.routes");
const visitRoutes = require("./visit.routes");
const inquiryRoutes = require("./inquiry.routes");
const agentRoutes = require("./agent.routes");
const userRoutes = require("./user.routes");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API"
  });
});

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/agent", agentRoutes);
router.use("/categories", categoryRoutes);
router.use("/properties", propertyRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/visits", visitRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/", userRoutes);

module.exports = router;
