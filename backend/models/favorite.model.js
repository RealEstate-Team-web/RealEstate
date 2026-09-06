const { query, toDateKey } = require("../config/db.config");

const Favorite = {
  async listByUser(userId) {
    const sql = `
      SELECT 
        f.id AS favoriteId,
        f.created_at AS favoritedAt,
        p.id,
        p.title,
        p.description,
        p.listing_type AS listingType,
        p.price,
        p.bedrooms,
        p.bathrooms,
        p.parking_spaces AS parkingSpaces,
        p.area,
        p.country,
        p.city,
        p.address,
        p.latitude,
        p.longitude,
        p.status,
        p.views,
        c.name AS categoryName,
        (
          SELECT pi.image_url 
          FROM property_images pi 
          WHERE pi.property_id = p.id 
          ORDER BY pi.is_cover DESC, pi.sort_order ASC, pi.id ASC 
          LIMIT 1
        ) AS imageUrl
      FROM favorites f
      JOIN properties p ON p.id = f.property_id
      LEFT JOIN property_categories c ON c.id = p.category_id
      WHERE f.user_id = ?
      ORDER BY f.created_at DESC
    `;
    return query(sql, [userId]);
  },

  async findFavorite(userId, propertyId) {
    const rows = await query(
      "SELECT id, user_id, property_id, created_at FROM favorites WHERE user_id = ? AND property_id = ?",
      [userId, propertyId]
    );
    return rows[0] || null;
  },

  async create(userId, propertyId) {
    const result = await query(
      "INSERT INTO favorites (user_id, property_id) VALUES (?, ?)",
      [userId, propertyId]
    );
    return result.insertId;
  },

  async delete(userId, propertyId) {
    const result = await query(
      "DELETE FROM favorites WHERE user_id = ? AND property_id = ?",
      [userId, propertyId]
    );
    return result.affectedRows;
  },

  async countByUser(userId) {
    const rows = await query(
      "SELECT COUNT(*) AS count FROM favorites WHERE user_id = ?",
      [userId]
    );
    return rows[0]?.count ? Number(rows[0].count) : 0;
  },

  async countByAgent(agentId) {
    const rows = await query(
      `SELECT COUNT(*) AS count
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE p.agent_id = ?`,
      [agentId]
    );
    return rows[0]?.count ? Number(rows[0].count) : 0;
  },

  async countByAgentDay(agentId, days) {
    const rows = await query(
      `SELECT DATE(f.created_at) AS date, COUNT(*) AS count
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE p.agent_id = ?
         AND f.created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(f.created_at)
       ORDER BY date ASC`,
      [agentId, Number(days)]
    );
    return rows.map((row) => ({
      date: toDateKey(row.date),
      count: Number(row.count) || 0,
    }));
  },

  async countByAgentProperties(agentId, propertyIds) {
    if (!Array.isArray(propertyIds) || propertyIds.length === 0) return [];
    const placeholders = propertyIds.map(() => "?").join(", ");
    const rows = await query(
      `SELECT f.property_id AS propertyId, COUNT(*) AS count
       FROM favorites f
       JOIN properties p ON p.id = f.property_id
       WHERE p.agent_id = ?
         AND f.property_id IN (${placeholders})
       GROUP BY f.property_id`,
      [agentId, ...propertyIds]
    );
    return rows.map((row) => ({
      propertyId: Number(row.propertyId),
      count: Number(row.count) || 0,
    }));
  },
};

module.exports = Favorite;
