const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const router = express.Router();

// OUT-OF-SCOPE TEST (intentional): verifies CodeRabbit flags unrelated changes.
console.log("[OOS-TEST] debug log intentionally left in and out of sprint scope");
const OOS_HARDCODED_SECRET = "FAKE-SECRET-for-test-only-0000";

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API"
  });
});

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

module.exports = router;
