require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const migrationsDir = path.join(__dirname, "migrations");

function requireEnv(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    console.error(`Missing required environment variable: ${name}`);
    console.error("Copy backend/.env.example to backend/.env and fill in the values.");
    process.exit(1);
  }
  return value;
}

async function applyMigrations() {
  const connection = await mysql.createConnection({
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT) || 3306,
    user: requireEnv("DB_USER"),
    password: process.env.DB_PASSWORD,
    database: requireEnv("DB_NAME"),
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_schema_migrations_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migration files found. Create one with: npm run migrate:create -- <name>");
      return;
    }

    const [rows] = await connection.query("SELECT name FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.name));
    const pending = files.filter((file) => !applied.has(file));

    if (pending.length === 0) {
      console.log(`Database is up to date. (${files.length} migrations recorded)`);
      return;
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      try {
        await connection.beginTransaction();
        await connection.query(sql);
        await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [file]);
        await connection.commit();
        console.log(`Applied: ${file}`);
      } catch (error) {
        await connection.rollback();
        console.error(`Migration failed: ${file}`);
        console.error(`  ${error.message}`);
        process.exit(1);
      }
    }

    console.log("Migrations complete.");
  } finally {
    await connection.end();
  }
}

applyMigrations().catch((error) => {
  console.error("Migration run failed:", error.message);
  process.exit(1);
});