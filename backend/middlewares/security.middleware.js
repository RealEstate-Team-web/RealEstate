const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

const loginLimit = process.env.LOGIN_RATE_LIMIT
  ? Number(process.env.LOGIN_RATE_LIMIT)
  : isProduction
    ? 5
    : 0;

const registerLimit = process.env.REGISTER_RATE_LIMIT
  ? Number(process.env.REGISTER_RATE_LIMIT)
  : isProduction
    ? 10
    : 0;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: loginLimit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: () => loginLimit === 0,
  message: {
    success: false,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: registerLimit,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => registerLimit === 0,
  message: {
    success: false,
    message: "Too many registration attempts from this device. Please try again later.",
  },
});

module.exports = { loginLimiter, registerLimiter };