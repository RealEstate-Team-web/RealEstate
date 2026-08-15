const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "migrations");
const nameArg = process.argv[2];

if (!nameArg) {
  console.error("Usage: npm run migrate:create -- <migration_name>");
  console.error("Example: npm run migrate:create -- create_users");
  process.exit(1);
}

const name = nameArg.trim().replace(/\s+/g, "_");

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const existing = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"));
let maxNumber = 0;

for (const file of existing) {
  const match = file.match(/^(\d+)_/);
  if (match) {
    maxNumber = Math.max(maxNumber, parseInt(match[1], 10));
  }
}

const nextNumber = String(maxNumber + 1).padStart(3, "0");
const fileName = `${nextNumber}_${name}.sql`;
const filePath = path.join(migrationsDir, fileName);

fs.writeFileSync(filePath, "");

console.log(`Created migration: database/migrations/${fileName}`);
console.log("Write the SQL for the change, then apply it with: npm run migrate");