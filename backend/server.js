const { validateEnv } = require("./config/env");

validateEnv();

const app = require("./app");
const { pool } = require("./config/db.config");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connection established.");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Server startup aborted.");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });
}

startServer();
