require("dotenv").config();
const { query } = require("../config/db.config");

const PLANS = [
  {
    name: "Basic",
    slug: "basic",
    price: 500,
    currency: "ETB",
    duration_days: 30,
    property_limit: 5,
    images_per_property: 5,
    features: JSON.stringify([
      "Publish up to 5 properties",
      "5 images per property",
      "Standard listing visibility",
      "Buyer inquiries and visit requests",
    ]),
    description:
      "The starter plan for agents getting started with Betenya, with limited listings per month.",
  },
  {
    name: "Pro",
    slug: "pro",
    price: 1000,
    currency: "ETB",
    duration_days: 30,
    property_limit: 20,
    images_per_property: 10,
    features: JSON.stringify([
      "Publish up to 20 properties",
      "10 images per property",
      "Featured property highlighting",
      "Buyer inquiries and visit requests",
      "Listing analytics dashboard",
      "Priority listing placement",
    ]),
    description:
      "The most popular plan for active agents, featuring analytics and priority listing placement.",
  },
  {
    name: "Premium",
    slug: "premium",
    price: 2000,
    currency: "ETB",
    duration_days: 30,
    property_limit: 50,
    images_per_property: 20,
    features: JSON.stringify([
      "Publish up to 50 properties",
      "20 images per property",
      "Featured property highlighting",
      "Buyer inquiries and visit requests",
      "Listing analytics dashboard",
      "Priority listing placement",
      "Verified agent badge",
      "Dedicated support",
    ]),
    description:
      "The premium plan for professional agents and agencies with maximum visibility and support.",
  },
];

async function seedSubscriptionPlans() {
  for (const plan of PLANS) {
    await query(
      `INSERT IGNORE INTO subscription_plans
        (name, slug, price, currency, duration_days, property_limit, images_per_property, features, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        plan.name,
        plan.slug,
        plan.price,
        plan.currency,
        plan.duration_days,
        plan.property_limit,
        plan.images_per_property,
        plan.features,
        plan.description,
      ]
    );
  }
}

(async () => {
  try {
    await seedSubscriptionPlans();
    const rows = await query("SELECT COUNT(*) AS count FROM subscription_plans");
    console.log(`Subscription plans seeded. Total in DB: ${rows[0].count}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();