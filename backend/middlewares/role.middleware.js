const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Authentication required");
      error.status = 401;
      return next(error);
    }

    if (!roles.includes(req.user.role)) {
      const error = new Error("Insufficient permissions");
      error.status = 403;
      return next(error);
    }

    next();
  };
};

const requireApprovedAgent = (req, res, next) => {
  if (!req.user) {
    const error = new Error("Authentication required");
    error.status = 401;
    return next(error);
  }

  if (req.user.role !== "agent") {
    const error = new Error("Insufficient permissions");
    error.status = 403;
    return next(error);
  }

  if (req.user.agentProfileStatus !== "approved") {
    const error = new Error(
      "Your account is under review by an administrator. You can post properties once approved."
    );
    error.status = 403;
    return next(error);
  }

  next();
};

module.exports = { requireRole, requireApprovedAgent };