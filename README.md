# Real Estate Website

Full-stack real estate marketplace where **buyers** browse and visit properties, **agents** create and manage their own listings, and **admins** manage the platform.

## Features

- **Public marketplace** — landing page, property listing, search/filter/sort/pagination, and property details.
- **Authentication & roles** — buyer / agent / admin with JWT, bcrypt password hashing, and route-level authorization middleware.
- **Buyer dashboard** — favorites, visit bookings, inquiries, messages, and notifications.
- **Agent module** — property CRUD, image upload, visit request approval, analytics, and agent profile. Agents own property creation (listings publish instantly — no admin approval).
- **Admin dashboard** — user & agent management, agent approval, category management, reports, and analytics.
- **Image uploads** — Cloudinary-backed image storage with per-entity folders (`real-estate/properties/{id}`, `agents/{id}`, `profiles/{id}`).
- **Trello project management** — sprint cards synced to the team board.

## Tech Stack

- **Frontend:** React 19 + Vite (`frontend/`)
- **Backend:** Node.js + Express 5 (`backend/`)
- **Database:** MySQL via `mysql2` (raw SQL, no ORM), migrations in `backend/database/migrations/`
- **Auth:** JWT + bcrypt
- **Image uploads:** Cloudinary + multer
- **Project management:** Trello (via the official Trello MCP)

## Project Structure

```
├── backend/          Node.js + Express API (routes → controllers → services → models)
├── frontend/         React + Vite client (pages, components, services, hooks, context)
└── Documentation/    Planning docs (API, database, sprint plan, wireframes, standards)
```

## Getting Started

Prerequisites: Node.js 18+, MySQL 8.x.

### Backend

```bash
cd backend
npm install
cp .env.example .env    # set MySQL + Cloudinary credentials
npm run dev
```

Useful scripts (run from `backend/`):

```bash
npm run migrate          # apply pending SQL migrations
npm run migrate:create   # scaffold a new migration file
npm run upload:check     # verify Cloudinary setup (uploads + deletes a test image)
npm start                # production-style start
```

See [`backend/README.md`](backend/README.md) for the full backend setup guide.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Health Check

```
GET http://localhost:5000/api/health
```

```json
{
  "success": true,
  "message": "API is running",
  "database": "connected"
}
```

## Documentation

- [`Documentation/Sprint-Plan.md`](Documentation/Sprint-Plan.md) — sprint plan for Sprints 1–3 (Trello-ready cards)
- [`Documentation/API Design.md`](Documentation/API Design.md) — REST API reference
- [`Documentation/database_redesigned.md`](Documentation/database_redesigned.md) — database schema (source of truth)
- [`Documentation/Team Task Allocation.md`](Documentation/Team Task Allocation.md) — developer ownership
- [`Documentation/wirefram.md`](Documentation/wirefram.md) — wireframes & page specs
- [`Documentation/stack_tool.md`](Documentation/stack_tool.md) — technology stack decisions
- [`Documentation/Coding-Standards.md.md`](Documentation/Coding-Standards.md.md) — coding conventions
- [`Documentation/Security-Guidelines.md.md`](Documentation/Security-Guidelines.md.md) — security requirements
- [`Documentation/GIthub workflow.md`](Documentation/GIthub workflow.md) — branch & PR workflow
- `PROGRESS.md` — implementation status (local, gitignored)

## Developer Ownership

| Developer | Module |
|---|---|
| Developer 1 | Authentication + Admin Dashboard |
| Developer 2 | Landing Page (header, footer, testimonials, property list) |
| Developer 3 | Buyer / Tenant Dashboard |
| Developer 4 | Agent Module (property creation & management) |