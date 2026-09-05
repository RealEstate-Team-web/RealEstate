require("dotenv").config();
const { pool } = require("../config/db.config");

const AMENITIES = [
  "Parking",
  "Wi-Fi",
  "Swimming Pool",
  "Gym",
  "Balcony",
  "Elevator",
  "Furnished",
  "Garden",
  "Air Conditioning",
  "Security System",
  "Backup Power",
  "Water Tank",
];

async function main() {
  const placeholders = AMENITIES.map(() => "(?, ?)").join(", ");
  const params = AMENITIES.map((name) => [name, null]).flat();

  const [result] = await pool.query(
    `INSERT IGNORE INTO amenities (name, description)
     VALUES ${placeholders}`,
    params
  );

  console.log(`Amenities ensured (inserted/ignored rows: ${result.affectedRows}).`);
  console.log("Standard amenities:", AMENITIES.join(", "));
}

main()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => pool.end());