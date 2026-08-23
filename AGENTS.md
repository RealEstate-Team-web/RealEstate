# AGENTS.md

Project-wide guidance for AI agents and developers working in this repository.

## Project

Real Estate Website — full-stack marketplace (buyers browse/visit, agents list properties, admin approves agents and manages the platform).

## Backend foundation (implemented)

The backend initial foundation is complete and feature branches can build on it:

- Express app setup in `backend/app.js` (Helmet, CORS from `CLIENT_URL`, JSON/URL-encoded parsing, Morgan)
- Entry point `backend/server.js` — validates env vars, verifies MySQL connection, then listens
- MySQL pool in `backend/config/db.config.js` (mysql2/promise) — reuse `pool`/`query` in models
- Env validation in `backend/config/env.js` — fails fast if required vars are missing
- `GET /api/health` in `backend/routes/index.js` + `health.routes.js`
- Central 404 + global error middleware (`middlewares/`)
- Copy `.env.example` → `.env` and set local MySQL credentials before running

## First, read these

- `PROGRESS.md` — implementation status (source of truth for what's done/pending)
- `Documentation/` — planning docs (API, database, wireframes, task allocation)
- `.opencode/skills/` — load the matching skill for the task (e.g. `database`, `api`, `coding-standards`)

## Stack

- Frontend: React 19 + Vite 8 (`frontend/`)
- Backend: Node.js + Express 5 (`backend/`)
- Database: MySQL via `mysql2` driver (raw SQL, no ORM)

## Commands

```bash
# Backend (from backend/)
npm run dev      # nodemon server.js
npm start        # node server.js

# Frontend (from frontend/)
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # eslint
```

## Folder conventions

- Backend: `routes/` (HTTP only) → `controllers/` (req/res) → `services/` (business logic) → `models/` (SQL only)
- Frontend: `pages/`, `components/`, `services/` (API only), `hooks/`, `context/`, `utils/`, `layouts/`, `routes/`
- Files camelCase (`auth.controller.js`), components PascalCase (`PropertyCard.jsx`)

## Rules

- Read `PROGRESS.md` first; never re-scan the whole repo for status
- Use parameterized SQL, bcrypt for passwords, JWT in `.env` only — see `security-guidelines` skill
- Never commit `.env`, `node_modules`, `uploads`
- Update `PROGRESS.md` after every completed task
- Keep changes scoped to the assigned developer's files (see `file-ownership` skill)


# Real Estate Project — Code Review Guidelines

## Source of Truth

Before reviewing a Pull Request, use these documents:

1. Documentation/Sprints/CURRENT-SPRINT.md
2. The sprint document referenced by CURRENT-SPRINT.md
3. Documentation/database_redesigned.md
4. Documentation/API Design.md
5. Documentation/Coding-Standards.md
6. Documentation/Security-Guidelines.md

Project documentation takes precedence over generic assumptions.

Do not invent project requirements.

---

## Sprint Scope

The current sprint is defined by:

Documentation/Sprints/CURRENT-SPRINT.md

A Pull Request must be evaluated against the current sprint.

Classify changes as:

- Required
- Supporting
- Out of scope
- Unrelated

Do not automatically reject supporting work.

Do flag significant unrelated or future-sprint functionality.

---

## Security

Always check:

- SQL injection
- authentication bypass
- authorization bypass
- IDOR
- privilege escalation
- insecure password handling
- JWT security
- input validation
- file upload security
- secret exposure
- unsafe CORS
- XSS
- sensitive data exposure

---

## Database

Compare database changes against:

Documentation/database_redesigned.md

Check:

- normalization
- relationships
- foreign keys
- indexes
- constraints
- data types
- migrations
- nullable fields
- duplicate data

---

## API

Compare API changes against:

Documentation/API Design.md

Check:

- HTTP methods
- endpoint paths
- authentication
- authorization
- request validation
- response format
- HTTP status codes
- error handling

---

## Cloudinary

Image uploads must follow the project's Cloudinary architecture.

Expected structure:

real-estate/
├── properties/{propertyId}
├── agents/{agentId}
└── profiles/{userId}

Never expose Cloudinary secrets to the frontend.

Verify authorization before uploads.

Verify property ownership before property-image uploads.

Validate uploaded files.

---

## Final Review

Every PR review should identify:

1. Critical problems
2. Security problems
3. Database problems
4. API problems
5. Frontend problems
6. Backend problems
7. Testing gaps
8. Out-of-scope work

The Team Lead makes the final merge decision.