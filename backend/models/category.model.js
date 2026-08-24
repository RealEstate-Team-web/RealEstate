const { query } = require("../config/db.config");

const Category = {
  async list() {
    const rows = await query(
      "SELECT id, name, description, created_at, updated_at FROM property_categories ORDER BY name ASC"
    );
    return rows;
  },

  async getById(id) {
    const rows = await query(
      "SELECT id, name, description, created_at, updated_at FROM property_categories WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async findByName(name) {
    const rows = await query(
      "SELECT id FROM property_categories WHERE name = ?",
      [name]
    );
    return rows[0];
  },

  async create({ name, description }) {
    const result = await query(
      "INSERT INTO property_categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    return { id: result.insertId, name, description: description || null };
  },

  async update(id, { name, description }) {
    const result = await query(
      "UPDATE property_categories SET name = ?, description = ? WHERE id = ?",
      [name, description || null, id]
    );
    return result.affectedRows;
  },

  async remove(id) {
    const result = await query("DELETE FROM property_categories WHERE id = ?", [
      id,
    ]);
    return result.affectedRows;
  },
};

module.exports = Category;
