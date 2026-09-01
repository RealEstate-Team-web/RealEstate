const { query } = require("../config/db.config");

const User = {
  async findUserByEmail(email) {
    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  async findById(userId) {
    const rows = await query("SELECT * FROM users WHERE id = ?", [userId]);
    return rows[0];
  },

  async listUsers({ role, status, page = 1, limit = 10 } = {}) {
    const conditions = [];
    const params = [];
    if (role) {
      conditions.push("role = ?");
      params.push(role);
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }
    const where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";

    const [totalRow] = await query(
      `SELECT COUNT(*) AS count FROM users${where}`,
      params
    );

    const l = Math.max(1, Math.min(Number(limit) || 10, 100));
    const p = Math.max(1, Number(page) || 1);
    const offset = (p - 1) * l;

    const items = await query(
      `SELECT id, first_name AS firstName, last_name AS lastName, email, phone, role, status, created_at AS createdAt
         FROM users${where}
         ORDER BY created_at DESC, id DESC
         LIMIT ? OFFSET ?`,
      [...params, l, offset]
    );

    const [activeRow] = await query(
      "SELECT COUNT(*) AS count FROM users WHERE status = 'active'"
    );
    const [suspendedRow] = await query(
      "SELECT COUNT(*) AS count FROM users WHERE status = 'suspended'"
    );
    const [adminsRow] = await query(
      "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'"
    );

    const total = Number(totalRow.count);
    const totalPages = Math.max(1, Math.ceil(total / l));
    return {
      items,
      total,
      active: Number(activeRow.count),
      suspended: Number(suspendedRow.count),
      admins: Number(adminsRow.count),
      page: p,
      limit: l,
      totalPages,
      hasNextPage: p < totalPages,
      hasPrevPage: p > 1,
    };
  },

  async setStatus(id, status) {
    const result = await query(
      "UPDATE users SET status = ?, updated_at = NOW() WHERE id = ? AND status <> ?",
      [status, id, status]
    );
    return result.affectedRows;
  },

  async createUser({ firstName, lastName, email, phone, role = "buyer" }) {
    const result = await query(
      `INSERT INTO users (first_name, last_name, email, phone, role)
       VALUES (?, ?, ?, ?, ?)`,
      [firstName, lastName, email, phone, role],
    );
    return result.insertId;
  },

  async createUserCredentials({ userId, passwordHash }) {
    await query(
      "INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)",
      [userId, passwordHash],
    );
  },

  async createAgentProfile({
    userId,
    agencyName,
    licenseNumber,
    experienceYears,
  }) {
    await query(
      `INSERT INTO agent_profiles
         (user_id, agency_name, license_number, experience_years, verification_status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [
        userId,
        agencyName,
        licenseNumber,
        experienceYears,
      ],
    );
  },


  async findUserWithCredentials(email) {
    const rows = await query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.role, u.status,
              u.profile_image_url, c.password_hash
       FROM users u
       JOIN user_credentials c ON c.user_id = u.id
       WHERE u.email = ?`,
      [email],
    );
    return rows[0];
  },

  async countByRole() {
    return query(
      "SELECT role, COUNT(*) AS count FROM users GROUP BY role",
    );
  },

  async countRegistrationsByDay(days) {
    return query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM users
       WHERE created_at >= CURDATE() - INTERVAL ? DAY
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [days],
    );
  },
};

module.exports = User;
