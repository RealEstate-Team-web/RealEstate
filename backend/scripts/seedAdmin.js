require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../config/db.config");

const ADMIN = {
  firstName: "Abebe",
  lastName: "Kebede",
  email: "admin@nesthome.com",
  phone: "0900000001",
  password: "Admin@123",
  role: "admin",
};

async function main() {
  const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [ADMIN.email]);
  if (existing.length) {
    console.log("Admin already exists:", ADMIN.email);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN.password, 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.execute(
      "INSERT INTO users (first_name, last_name, email, phone, role, status) VALUES (?, ?, ?, ?, ?, 'active')",
      [ADMIN.firstName, ADMIN.lastName, ADMIN.email, ADMIN.phone, ADMIN.role],
    );
    const userId = res.insertId;
    await conn.execute(
      "INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)",
      [userId, passwordHash],
    );
    await conn.commit();
    console.log(`Admin created -> email: ${ADMIN.email}  password: ${ADMIN.password}`);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
