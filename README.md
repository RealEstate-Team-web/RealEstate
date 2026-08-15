# Real Estate Website

Full-stack real estate marketplace where buyers browse and visit properties, agents list properties, and admins manage the platform.

## Tech Stack

- **Frontend:** React 19 + Vite (`frontend/`)
- **Backend:** Node.js + Express 5 (`backend/`)
- **Database:** MySQL via `mysql2` (raw SQL, no ORM)
- **Auth:** JWT + bcrypt

## Project Structure

```
├── backend/        Node.js + Express API
├── frontend/       React + Vite client
├── Documentation/  Planning docs (API, database, wireframes, standards)


## Getting Started

### Backend

```bash
cd backend
npm install
cp .env.example .env        # then set your local MySQL credentials
npm run dev
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

- `Documentation/Coding-Standards.md.md` — coding conventions
- `Documentation/Security-Guidelines.md.md` — security requirements
- `Documentation/API Design.md` — REST API reference
- `Documentation/database_redesigned.md` — database schema
- `Documentation/Team Task Allocation.md` — developer ownership
- `PROGRESS.md` — implementation status
