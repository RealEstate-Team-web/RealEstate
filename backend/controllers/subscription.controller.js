const subscriptionService = require("../services/subscription.service");

// POST /api/subscriptions/checkout
// Creates a pending subscription/payment and returns the Chapa checkout URL.
const checkout = async (req, res, next) => {
  try {
    const data = await subscriptionService.checkout(req.user, {
      planId: req.body.planId,
    });
    res.status(200).json({
      success: true,
      message: "Checkout initialized",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/current
// Returns the authenticated agent's current subscription state.
const getCurrent = async (req, res, next) => {
  try {
    const data = await subscriptionService.getCurrent(req.user.id);
    res.status(200).json({
      success: true,
      message: "Current subscription",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkout, getCurrent };