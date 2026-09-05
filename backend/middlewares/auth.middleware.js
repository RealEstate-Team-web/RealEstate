const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db.config");

async function getAgentProfileStatus(userId) {
  const rows = await pool.execute(
    "SELECT verification_status FROM agent_profiles WHERE user_id = ?",
    [userId],
  );
  return rows[0][0] ? rows[0][0].verification_status : "incomplete";
}

async function findSessionUser(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findUserByEmail(payload.email);

  if (!user) return null;

  const agentProfileStatus =
    user.role === "agent" ? await getAgentProfileStatus(user.id) : null;

  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    profileImageUrl: user.profile_image_url || null,
    agentProfileStatus,
  };
}

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  try {
    req.user = await findSessionUser(header.split(" ")[1]);

    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    if (req.user.status === "suspended") {
      const error = new Error("Account is suspended");
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    const err = new Error(
      error.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Invalid or expired token",
    );
    err.status = 401;
    return next(err);
  }
};

// Populates req.user when a valid token is present; otherwise continues anonymously.
const authenticateOptional = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) return next();

  try {
    const user = await findSessionUser(header.split(" ")[1]);
    if (user && user.status !== "suspended") {
      req.user = user;
    }
  } catch {
    // Ignore invalid or expired tokens on optional routes.
  }

  next();
};

module.exports = { authenticate, authenticateOptional };