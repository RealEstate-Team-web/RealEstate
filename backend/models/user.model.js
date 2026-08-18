const { query } = require("../config/db.config");

const User = {
  async findUserByEmail(email) {
    const rows = await query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
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
};

module.exports = User;
