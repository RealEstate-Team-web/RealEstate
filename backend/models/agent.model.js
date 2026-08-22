const { query } = require("../config/db.config");

const Agent = {
  async countUsers() {
    return query("SELECT COUNT(*) AS count FROM users");
  },

  async countAgents() {
    return query("SELECT COUNT(*) AS count FROM users WHERE role = 'agent'");
  },

  async countByVerificationStatus() {
    return query(
      "SELECT verification_status, COUNT(*) AS count FROM agent_profiles GROUP BY verification_status",
    );
  },

  async countSuspendedUsers() {
    return query("SELECT COUNT(*) AS count FROM users WHERE status = 'suspended'");
  },

  async recentAgents(limit = 5) {
    return query(
      `SELECT ap.id, ap.agency_name AS agency, ap.license_number AS licenseNumber,
              ap.experience_years AS experienceYears, ap.specialization, ap.city,
              ap.verification_status AS status, ap.created_at,
              u.id AS userId, u.first_name, u.last_name, u.email, u.phone,
              u.status AS userStatus, u.profile_image_url
       FROM agent_profiles ap
       JOIN users u ON u.id = ap.user_id
       ORDER BY ap.created_at DESC
       LIMIT ?`,
      [limit],
    );
  },

  async listAgents({ status } = {}) {
    const params = [];
    let sql = `
      SELECT ap.id, ap.agency_name AS agency, ap.license_number AS licenseNumber,
             ap.experience_years AS experienceYears, ap.specialization, ap.city,
             ap.verification_status AS status, ap.created_at,
             u.id AS userId, u.first_name, u.last_name, u.email, u.phone,
             u.status AS userStatus, u.profile_image_url
      FROM agent_profiles ap
      JOIN users u ON u.id = ap.user_id`;

    if (status) {
      sql += " WHERE ap.verification_status = ?";
      params.push(status);
    }

    sql += " ORDER BY ap.created_at DESC";
    return query(sql, params);
  },

  async findById(id) {
    const rows = await query(
      `SELECT ap.id, ap.agency_name AS agency, ap.license_number AS licenseNumber,
              ap.verification_status AS status, ap.user_id AS userId,
              u.first_name, u.last_name, u.email, u.status AS userStatus
       FROM agent_profiles ap
       JOIN users u ON u.id = ap.user_id
       WHERE ap.id = ?`,
      [id],
    );
    return rows[0];
  },

  async setVerificationStatus(id, status) {
    await query(
      "UPDATE agent_profiles SET verification_status = ?, updated_at = NOW() WHERE id = ?",
      [status, id],
    );
  },

  async setUserStatus(userId, status) {
    await query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
  },
};

module.exports = Agent;
