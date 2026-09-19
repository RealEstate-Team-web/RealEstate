const SubscriptionPlan = require("../models/subscriptionPlan.model");

function conflict(message) {
  const error = new Error(message);
  error.status = 409;
  return error;
}

function notFound() {
  const error = new Error("Subscription plan not found");
  error.status = 404;
  return error;
}

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

async function listPlans() {
  return SubscriptionPlan.list();
}

async function getPublicPlans() {
  return SubscriptionPlan.listActive();
}

async function getPlan(id) {
  const plan = await SubscriptionPlan.getById(id);
  if (!plan) throw notFound();
  return plan;
}

async function createPlan(payload) {
  const name = String(payload.name).trim();
  const slug = String(payload.slug).trim().toLowerCase();

  const existing = await SubscriptionPlan.findBySlug(slug);
  if (existing) throw conflict("A subscription plan with this slug already exists");

  try {
    const id = await SubscriptionPlan.create({ ...payload, name, slug });
    return SubscriptionPlan.getById(id);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw conflict("A subscription plan with this slug already exists");
    }
    throw err;
  }
}

async function updatePlan(id, payload) {
  const plan = await SubscriptionPlan.getById(id);
  if (!plan) throw notFound();

  const fields = {};
  const allowedKeys = [
    "name",
    "slug",
    "price",
    "currency",
    "duration_days",
    "property_limit",
    "images_per_property",
    "features",
    "description",
    "is_active",
  ];
  for (const key of allowedKeys) {
    if (!Object.hasOwn(payload, key)) continue;
    if (key === "name") {
      fields.name = String(payload.name).trim();
    } else if (key === "slug") {
      fields.slug = String(payload.slug).trim().toLowerCase();
    } else if (key === "features") {
      fields.features = payload.features;
    } else if (key === "description") {
      fields.description = payload.description;
    } else if (key === "is_active") {
      fields.is_active = payload.is_active;
    } else {
      fields[key] = payload[key];
    }
  }

  if (fields.slug !== undefined && fields.slug !== plan.slug) {
    const existing = await SubscriptionPlan.findBySlug(fields.slug);
    if (existing && existing.id !== Number(id)) {
      throw conflict("A subscription plan with this slug already exists");
    }
  }

  try {
    await SubscriptionPlan.update(id, fields);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw conflict("A subscription plan with this slug already exists");
    }
    throw err;
  }

  return SubscriptionPlan.getById(id);
}

async function updatePlanStatus(id, isActive) {
  const plan = await SubscriptionPlan.getById(id);
  if (!plan) throw notFound();

  await SubscriptionPlan.updateActive(id, isActive);
  return SubscriptionPlan.getById(id);
}

async function deletePlan(id) {
  const plan = await SubscriptionPlan.getById(id);
  if (!plan) throw notFound();

  try {
    const affected = await SubscriptionPlan.remove(id);
    if (affected === 0) throw notFound();
  } catch (err) {
    if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
      throw badRequest(
        "This subscription plan is referenced by existing subscriptions. Deactivate it instead."
      );
    }
    throw err;
  }

  return { id: Number(id), deleted: true };
}

module.exports = {
  listPlans,
  getPublicPlans,
  getPlan,
  createPlan,
  updatePlan,
  updatePlanStatus,
  deletePlan,
};