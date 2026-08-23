require("dotenv").config();
const bcrypt = require("bcrypt");
const { pool } = require("../config/db.config");

const AGENTS = [
  {
    firstName: "Sara",
    lastName: "Tamrat",
    email: "sara.tamrat@nesthome.com",
    phone: "0900000101",
    agencyName: "NestHome Realty",
    licenseNumber: "LIC-1001",
    experienceYears: 5,
    city: "Addis Ababa",
  },
  {
    firstName: "Daniel",
    lastName: "Tesfaye",
    email: "daniel.tesfaye@nesthome.com",
    phone: "0900000102",
    agencyName: "NestHome Realty",
    licenseNumber: "LIC-1002",
    experienceYears: 3,
    city: "Bahir Dar",
  },
  {
    firstName: "Liya",
    lastName: "Bekele",
    email: "liya.bekele@nesthome.com",
    phone: "0900000103",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-1003",
    experienceYears: 8,
    city: "Hawassa",
  },
  {
    firstName: "Mekdes",
    lastName: "Alemu",
    email: "mekdes.alemu@nesthome.com",
    phone: "0900000104",
    agencyName: "Skyline Properties",
    licenseNumber: "LIC-1004",
    experienceYears: 2,
    city: "Adama",
  },
  {
    firstName: "Hana",
    lastName: "Bekele",
    email: "hana.bekele@nesthome.com",
    phone: "0900000105",
    agencyName: "Urban Nest",
    licenseNumber: "LIC-1005",
    experienceYears: 6,
    city: "Mekelle",
  },
];

const PASSWORD = "Agent@123";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  for (const a of AGENTS) {
    const [existing] = await pool.execute("SELECT id FROM users WHERE email = ?", [
      a.email,
    ]);
    if (existing.length) {
      console.log("Skip (exists):", a.email);
      continue;
    }

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [res] = await conn.execute(
        "INSERT INTO users (first_name, last_name, email, phone, role, status) VALUES (?, ?, ?, ?, 'agent', 'active')",
        [a.firstName, a.lastName, a.email, a.phone],
      );
      const userId = res.insertId;

      await conn.execute(
        "INSERT INTO user_credentials (user_id, password_hash) VALUES (?, ?)",
        [userId, passwordHash],
      );
      await conn.execute(
        `INSERT INTO agent_profiles
           (user_id, agency_name, license_number, experience_years, city, verification_status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [userId, a.agencyName, a.licenseNumber, a.experienceYears, a.city],
      );
      await conn.commit();
      console.log(`Agent created -> ${a.firstName} ${a.lastName} (${a.email})`);
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  console.log(`\nDone. All seeded agents use password: ${PASSWORD}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());
