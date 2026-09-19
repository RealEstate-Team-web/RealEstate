const { query } = require("../config/db.config");

const COLUMNS =
  "id, name, slug, price, currency, duration_days, property_limit, images_per_property, features, description, is_active, created_at, updated_at";

function parseFeatures(features) {
  if (features == null) return null;
  if (Array.isArray(features)) return features;
  try {
    return JSON.parse(features);
  } catch {
    return null;
  }
}

function mapPlan(row) {
  if (!row) return null;
  return { ...row, features: parseFeatures(row.features) };
}

const SubscriptionPlan = {
  async list() {
    const rows = await query(
      `SELECT ${COLUMNS} FROM subscription_plans ORDER BY price ASC`
    );
    return rows.map(mapPlan);
  },

  async listActive() {
    const rows = await query(
      `SELECT ${COLUMNS} FROM subscription_plans WHERE is_active = 1 ORDER BY price ASC`
    );
    return rows.map(mapPlan);
  },

  async getById(id) {
    const rows = await query(
      `SELECT ${COLUMNS} FROM subscription_plans WHERE id = ?`,
      [id]
    );
    return mapPlan(rows[0]);
  },

  async findBySlug(slug) {
    const rows = await query(
      "SELECT id FROM subscription_plans WHERE slug = ?",
      [slug]
    );
    return rows[0];
  },

  async create({
    name,
    slug,
    price,
    currency,
    duration_days,
    property_limit,
    images_per_property,
    features,
    description,
    is_active,
  }) {
    const result = await query(
      `INSERT INTO subscription_plans
        (name, slug, price, currency, duration_days, property_limit, images_per_property, features, description, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        slug,
        price,
        currency,
        duration_days,
        property_limit,
        images_per_property,
        features ? JSON.stringify(features) : null,
        description || null,
        is_active === undefined || is_active === null ? 1 : is_active,
      ]
    );
    return result.insertId;
  },

  async update(id, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return 0;
    const values = [];
    const setClause = keys.map((key) => {
      if (key === "features") {
        values.push(fields[key] ? JSON.stringify(fields[key]) : null);
        return "features = ?";
      }
      if (key === "description") {
        values.push(fields[key] || null);
        return "description = ?";
      }
      if (key === "is_active") {
        values.push(fields[key] === undefined || fields[key] === null ? 1 : fields[key]);
        return "is_active = ?";
      }
      values.push(fields[key]);
      return `${key} = ?`;
    });
    values.push(id);
    const result = await query(
      `UPDATE subscription_plans SET ${setClause.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows;
  },

  async updateActive(id, isActive) {
    const result = await query(
      "UPDATE subscription_plans SET is_active = ? WHERE id = ?",
      [isActive ? 1 : 0, id]
    );
    return result.affectedRows;
  },

  async remove(id) {
    const result = await query("DELETE FROM subscription_plans WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

module.exports = SubscriptionPlan;