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

  async listAgents({ status, q } = {}) {
    const params = [];
    const conditions = [];
    let sql = `
      SELECT ap.id, ap.agency_name AS agency, ap.license_number AS licenseNumber,
             ap.experience_years AS experienceYears, ap.specialization, ap.city,
             ap.verification_status AS status, ap.created_at,
             u.id AS userId, u.first_name, u.last_name, u.email, u.phone,
             u.status AS userStatus, u.profile_image_url
      FROM agent_profiles ap
      JOIN users u ON u.id = ap.user_id`;

    if (status) {
      conditions.push("ap.verification_status = ?");
      params.push(status);
    }
    if (q) {
      const term = `%${q}%`;
      conditions.push("(u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ? OR ap.agency_name LIKE ? OR ap.license_number LIKE ?)");
      params.push(term, term, term, term, term);
    }
    if (conditions.length) {
      sql += " WHERE " + conditions.join(" AND ");
    }

    sql += " ORDER BY ap.created_at DESC";
    return query(sql, params);
  },

  async listApprovedAgents(limit = 30) {
    const parsed = Number(limit);
    const safeLimit =
      Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 50) : 30;
    return query(
      `SELECT u.id AS userId, u.first_name, u.last_name, u.email, u.phone,
              u.profile_image_url AS photo, u.status AS userStatus,
              ap.agency_name AS agency, ap.specialization, ap.city,
              ap.experience_years AS experienceYears, ap.verification_status AS status,
              (
                SELECT COUNT(*)
                FROM properties p
                WHERE p.agent_id = u.id
                  AND p.status = 'available'
              ) AS propertyCount
       FROM agent_profiles ap
       JOIN users u ON u.id = ap.user_id
       WHERE ap.verification_status = 'approved'
       ORDER BY ap.experience_years DESC, ap.created_at DESC
       LIMIT ?`,
      [safeLimit],
    );
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
    const result = await query(
      "UPDATE agent_profiles SET verification_status = ?, updated_at = NOW() WHERE id = ? AND verification_status = 'pending'",
      [status, id],
    );
    return result.affectedRows;
  },

  async setUserStatus(userId, status) {
    await query("UPDATE users SET status = ? WHERE id = ?", [status, userId]);
  },
};

module.exports = Agent;
