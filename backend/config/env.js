const dotenv = require("dotenv");

dotenv.config();

const REQUIRED_ENV_VARS = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter(
    (name) => !process.env[name] || process.env[name].trim() === ""
  );

  if (missing.length > 0) {
    console.error("Missing required environment variables:", missing.join(", "));
    console.error("Copy .env.example to .env and fill in the missing values.");
    process.exit(1);
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
    isProduction: (process.env.NODE_ENV || "development") === "production",
  };
}

module.exports = { validateEnv, REQUIRED_ENV_VARS };
