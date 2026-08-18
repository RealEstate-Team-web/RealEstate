const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API"
  });
});

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

module.exports = router;
