# Database Migration Guide — Real Estate Website

How every developer creates and reviews database tables for this project.

**Source of truth:** `Documentation/database_redesigned.md` (the approved schema). Do not invent a different architecture, rename tables/columns, change primary keys, or alter foreign-key relationships. If the approved schema must change, report the change to the team before applying it.

---

## 1. Feature ownership (who creates which tables)

| Developer | Feature | Tables they own |
|---|---|---|
| Dev 1 | Authentication + Admin Dashboard | `users`, `user_credentials`, `password_reset_tokens`, `agent_profiles` |
| Dev 2 | Landing Page (public browse, read-only) | none — reads `properties`, `property_categories` |
| Dev 3 | Buyer/Tenant Dashboard | `favorites`, `visit_bookings`, `messages`, `notifications` |
| Dev 4 | Agent Module (property creation) | `properties`, `property_images`, `property_categories`, `amenities`, `property_amenities` |

**The schema is shared.** A table is "owned" by a feature developer, but everything is version-controlled and anyone may raise issues. You may not modify a shared table without communicating with the team (see section 9).

---

## 2. Directory structure

```
backend/database/
├── migrations/           # version-controlled schema changes (the only place tables are created)
│   ├── 001_create_users.sql
│   ├── 002_create_user_credentials.sql
│   ├── 003_create_password_reset_tokens.sql
│   ├── 004_create_agent_profiles.sql
│   ├── 005_create_property_categories.sql
│   ├── 006_create_properties.sql
│   ├── 007_create_property_images.sql
│   ├── 008_create_amenities.sql
│   ├── 009_create_property_amenities.sql
│   ├── 010_create_favorites.sql
│   ├── 011_create_visit_bookings.sql
│   ├── 012_create_messages.sql
│   ├── 013_create_notifications.sql
│   └── ...
├── seeders/              # development/test seed data (never real user data)
└── migrate.js            # applies pending migrations in order
```

Never keep schema changes only on your local machine.

---

## 3. Naming convention

Format: `NNN_short_description.sql`

- Leading zero-padded number, **increasing in dependency order**:
  - `users` must exist before `properties` if `properties.agent_id` references `users.id`
  - `property_categories` must exist before `properties` if `properties.category_id` references `property_categories.id`
- Lower `snake_case` description, no spaces.
- Columns are lowercase `snake_case` (`first_name`, `user_id`, `created_at`), matching `Documentation/database_redesigned.md`. API JSON stays camelCase — the backend maps between them.

Example sequence:

```
001_create_users.sql
002_create_user_credentials.sql
003_create_password_reset_tokens.sql
004_create_agent_profiles.sql
005_create_property_categories.sql
006_create_properties.sql
007_create_property_images.sql
008_create_amenities.sql
009_create_property_amenities.sql
010_create_favorites.sql
011_create_visit_bookings.sql
012_create_messages.sql
013_create_notifications.sql
```

---

## 4. Create a migration file

```bash
cd backend
npm run migrate:create -- create_users
# creates database/migrations/<next-available-number>_create_users.sql
```

Write your SQL into that file, then apply it:

```bash
npm run migrate
```

The runner applies only files not already recorded in `schema_migrations`, in filename order, and records each one after a successful run. Re-running applies nothing new.

---

## 5. MySQL rules

- Use the syntax compatible with the project's MySQL version.
- Use `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `DEFAULT`, and `CHECK` where supported and appropriate.
- Add indexes for frequently queried foreign keys and search fields — not on every column.
- Use appropriate data types — not `VARCHAR` for everything:
  - `INT`/`BIGINT` for IDs
  - `VARCHAR` for short strings
  - `TEXT` for long descriptions
  - `DECIMAL` for money — **never `FLOAT`/`DOUBLE` for monetary values**, use `DECIMAL(precision, scale)`
  - `DATETIME`/`TIMESTAMP` for dates
  - `BOOLEAN`/`TINYINT` for boolean state

---

## 6. Foreign keys

- Every relationship must follow `Documentation/database_redesigned.md`.
- Enforce relationships with foreign keys, not just application code.

```sql
FOREIGN KEY (agent_id) REFERENCES users(id)
```

- Choose `ON DELETE` / `ON UPDATE` deliberately — do **not** default to `CASCADE` everywhere. Decide per business rule: cascade, restrict, or set the foreign key to `NULL`.
- Do not create circular foreign-key dependencies unless the approved design requires them.

---

## 7. Indexing

Create indexes for:

- foreign keys
- frequently searched columns (`email`, `city`, ...)
- frequently filtered columns
- frequently sorted columns where beneficial
- unique fields (use `UNIQUE` constraints)

Do not index every column — consider the actual query patterns first.

---

## 8. Security

- **Never store plaintext passwords.** Passwords are hashed by the auth service with bcrypt; the database stores only the hash.
- Never store `JWT_SECRET`, API keys, database passwords, or other secrets in SQL files.
- Never put real credentials into migration files.
- Test data in seeders must not contain real user data; test passwords must be hashed.
- Cloudinary API secrets stay on the backend only — never in the frontend or in SQL files. Store `image_url` and `public_id` for each uploaded image so Cloudinary assets can be managed or deleted later.

---

## 9. Shared tables (important rule)

If a developer needs to modify a shared table, they must communicate the change with the team first.

Example:

- Developer 3 needs `favorites.user_id` → that's fine, it references the existing `users.id`.
- If Developer 3 decides *"users needs a new column `account_status`"* → this changes a shared table. Communicate it, get the team's agreement, then create a **new** migration:

```
010_add_account_status_to_users.sql
```

Do **not** edit `001_create_users.sql` if it has already been merged/applied.

---

## 10. Migration rules

- **Never modify an already-applied migration.** If the requirements change, add a new migration:

```
002_create_categories.sql
003_create_properties.sql
004_add_status_to_properties.sql   ← new change
```

- Do not edit `003_create_properties.sql` after it was shared/applied. This keeps the database history reproducible.
- Recommended: write idempotent DDL where sensible (`CREATE TABLE IF NOT EXISTS`) so partial failures are safe to retry.
- Note: MySQL implicitly commits DDL statements, so a failed `INSERT`/record is rolled back but an already-executed `CREATE TABLE` will remain — clean up manually, then retry.

---

## 11. Database connection

- The Express app uses a **shared** MySQL connection pool (`backend/config/db.config.js`), implemented separately from migrations.
- Credentials come from environment variables (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`).
- Never hard-code credentials. Do not commit `.env`; commit `.env.example`.

---

## 12. Seeders (separate from migrations)

- Migrations define **structure**; seeders insert **development/test data**.
- Place seed files in `backend/database/seeders/`.
- Possible seed data: development roles, categories, test users, sample properties.
- Never insert real user data or real passwords.

---

## 13. Developer workflow for a database change

1. Read `Documentation/database_redesigned.md`.
2. Identify the tables belonging to your feature.
3. Check dependencies on tables owned by other developers.
4. Confirm the foreign-key relationships.
5. Create the migration file(s).
6. Test against a local MySQL database (`npm run migrate`).
7. Verify the resulting tables and relationships.
8. Test rollback / recovery where applicable.
9. Commit the migration files.
10. Push the feature branch.
11. Create a Pull Request.
12. Have another developer review the migration.
13. Fix review comments.
14. Merge into `develop`.

---

## 14. Pull Request database checklist

Before approving a database-related PR, verify:

- [ ] Migration follows `Documentation/database_redesigned.md`
- [ ] Table names are correct
- [ ] Column names are correct
- [ ] Data types are appropriate
- [ ] Primary keys are correct
- [ ] Foreign keys are correct
- [ ] Foreign-key actions are intentional
- [ ] Required `NOT NULL` constraints exist
- [ ] `UNIQUE` constraints exist where required
- [ ] Appropriate indexes exist
- [ ] No unnecessary indexes exist
- [ ] No plaintext passwords
- [ ] No secrets or credentials
- [ ] No real user data
- [ ] Migration ordering is correct
- [ ] Migration does not break existing tables
- [ ] SQL works on a clean database
- [ ] Migration files are committed
- [ ] No local database files are committed

---

## 15. Architectural rule

- Do **not** create a giant SQL file containing the entire database while the team is developing features independently.
- Use separate, ordered migration files. The repository should contain the complete database history, so a new developer can clone the repo and reproduce the schema from migrations alone.

---

## 16. Current project phase

We are establishing the **initial foundation**: MySQL connection, migration directory/strategy/naming, seeders directory, environment configuration, and this documentation. Feature tables become migration files in each developer's feature branch.