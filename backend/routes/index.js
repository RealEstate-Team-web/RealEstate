const express = require("express");
const healthRoutes = require("./health.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API",
  });
});

router.use("/health", healthRoutes);

module.exports = router;
