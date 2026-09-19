const subscriptionPlanService = require("../services/subscriptionPlan.service");

const getPublic = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.getPublicPlans();
    res.status(200).json({ success: true, message: "Subscription plans", data });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.listPlans();
    res.status(200).json({ success: true, message: "Subscription plans", data });
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.getPlan(req.params.id);
    res.status(200).json({ success: true, message: "Subscription plan", data });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.createPlan(req.body);
    res.status(201).json({ success: true, message: "Subscription plan created", data });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.updatePlan(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Subscription plan updated", data });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.updatePlanStatus(
      req.params.id,
      req.body.is_active
    );
    res.status(200).json({
      success: true,
      message: data.is_active ? "Subscription plan activated" : "Subscription plan deactivated",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const data = await subscriptionPlanService.deletePlan(req.params.id);
    res.status(200).json({ success: true, message: "Subscription plan deleted", data });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublic, list, getOne, create, update, updateStatus, remove };