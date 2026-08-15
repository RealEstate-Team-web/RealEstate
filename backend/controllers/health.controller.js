const { pool } = require("../config/db.config");

async function healthCheck(req, res) {
  let database = "disconnected";

  try {
    await pool.query("SELECT 1");
    database = "connected";
  } catch (error) {
    console.error("Health check database ping failed:", error.message);
  }

  res.status(200).json({
    success: true,
    message: "API is running",
    database,
    uptime: process.uptime(),
  });
}

module.exports = { healthCheck };
