const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findUserByEmail(payload.email);

    if (!user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    if (user.status === "suspended") {
      const error = new Error("Account is suspended");
      error.status = 403;
      return next(error);
    }

    req.user = {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status,
    };

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

module.exports = { authenticate };
