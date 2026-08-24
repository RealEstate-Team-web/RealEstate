require("dotenv").config();
const { query } = require("../config/db.config");

const CATEGORIES = [
  { name: "Apartment", description: "Flats and apartments for sale or rent." },
  { name: "Villa", description: "Luxury villas and standalone houses." },
  { name: "House", description: "Family houses and townhouses." },
  { name: "Commercial", description: "Offices, shops, and commercial spaces." },
  { name: "Land", description: "Plots and land parcels." },
];

async function seedCategories() {
  for (const category of CATEGORIES) {
    await query(
      "INSERT IGNORE INTO property_categories (name, description) VALUES (?, ?)",
      [category.name, category.description]
    );
  }
}

(async () => {
  try {
    await seedCategories();
    const rows = await query(
      "SELECT COUNT(*) AS count FROM property_categories"
    );
    console.log(`Categories seeded. Total in DB: ${rows[0].count}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
