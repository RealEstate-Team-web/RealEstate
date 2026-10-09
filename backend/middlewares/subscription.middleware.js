const Subscription = require("../models/subscription.model");

// Guards agent routes that require an active, unexpired subscription.
// Created as part of the payments module; enforcement on agent publishing
// routes is deferred to a follow-up task.
const requireActiveSubscription = async (req, res, next) => {
  try {
    const active = await Subscription.findActiveByUser(req.user.id);
    if (!active) {
      const error = new Error("An active subscription is required");
      error.status = 403;
      error.code = "ACTIVE_SUBSCRIPTION_REQUIRED";
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { requireActiveSubscription };