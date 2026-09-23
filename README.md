# Sportus — Personal Training Tracker

A single-user personal training application for managing an exercise catalog, logging workouts, tracking metrics over time, and visualizing progress. Built with a claymorphism UI aesthetic.

> **MVP Status**: Phase 1 complete. Single-user, no authentication, offline-friendly. Multi-user upgrade is architecturally prepared but not yet implemented.

---

## Table of Contents

- [Tech Stack & Versions](#tech-stack--versions)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Image Upload System](#image-upload-system)
- [Seed Data](#seed-data)
- [Future Roadmap](#future-roadmap)

---

## Tech Stack & Versions

### Runtime Requirements

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| Node.js | 22.x | Tested on 22.12 (x64) |
| npm | 10.x | Bundled with Node 22 |

### Backend

| Package | Version | Role |
|---------|---------|------|
| express | ^5.2.1 | HTTP server and routing |
| better-sqlite3 | ^11.10.0 | Synchronous SQLite driver |
| multer | ^2.3.0 | Multipart file uploads |
| cors | ^2.8.6 | Cross-origin request handling |
| dotenv | ^17.4.2 | Environment variable loading |
| nodemon | ^3.1.14 | Dev auto-reload (devDependency) |

> **Note on `better-sqlite3`**: version 11.10.0 is pinned intentionally. Version 13.x ships a broken prebuild for `win32-x64` / Node 22 that causes a `STATUS_ACCESS_VIOLATION` crash on any database call.

### Frontend

| Package | Version | Role |
|---------|---------|------|
| react | ^19.2.8 | UI library |
| react-dom | ^19.2.8 | DOM renderer |
| react-router-dom | ^7.18.3 | Client-side routing |
| recharts | ^3.10.1 | Line and bar charts |
| vite | ^8.2.2 | Build tool and dev server |
| @vitejs/plugin-react | ^6.1.0 | JSX transform and HMR |
| oxlint | ^1.79.0 | Linter (devDependency) |

---

## Project Structure

```
GymHub/
├── Docs/
│   ├── Specs.md                        # Product specification
│   └── Implementation-Log-08-09-2026.md
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.sql              # SQLite DDL (tables, indexes)
│   │   │   └── connection.js           # DB connection, pragma config, seed
│   │   ├── middleware/
│   │   │   ├── errorHandler.js         # Global error and 404 handlers
│   │   │   └── upload.js               # Multer config (disk storage, type/size limits)
│   │   ├── modules/
│   │   │   ├── sports/                 # routes → controller → repository
│   │   │   ├── subclassifications/
│   │   │   ├── exercises/
│   │   │   ├── metrics/
│   │   │   ├── trainingSessions/
│   │   │   └── stats/
│   │   ├── app.js                      # Express app setup, middleware, route mounts
│   │   └── server.js                   # HTTP server entry point
│   ├── uploads/                        # Uploaded photos (git-ignored)
│   ├── sportus.sqlite                  # SQLite database file (git-ignored)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                        # Per-resource fetch clients
│   │   ├── components/
│   │   │   ├── common/                 # Clay.jsx — design system components
│   │   │   ├── exercises/              # ExerciseForm.jsx
│   │   │   ├── diary/                  # EntryForm.jsx
│   │   │   └── charts/                 # ProgressLineChart.jsx, ActivityHeatmap.jsx
│   │   ├── pages/                      # CatalogPage, ExerciseDetailPage, DiaryPage,
│   │   │                               # StatsPage, MetricsPage, SettingsPage
│   │   └── styles/
│   │       └── theme.css               # Claymorphism CSS variables
│   ├── vite.config.js                  # Dev proxy: /api and /uploads → localhost:4000
│   └── package.json
├── .claude/
│   └── launch.json                     # Dev server config for Claude browser tool
└── .gitignore
```

---

## Architecture

### Overview

```
Browser (React + Vite)
       │  HTTP /api/*  (proxied in dev, direct in prod)
       ▼
Express 5 REST API (Node.js)
       │
       ├── Middleware layer
       │     ├── CORS
       │     ├── JSON body parser
       │     ├── Static file serving (/uploads)
       │     └── Global error handler
       │
       ├── Modules (routes → controller → repository)
       │     ├── sports
       │     ├── subclassifications
       │     ├── exercises  (+ photo upload)
       │     ├── metrics    (+ units)
       │     ├── training-sessions  (+ entries)
       │     └── stats
       │
       └── better-sqlite3 (synchronous)
              └── sportus.sqlite
```

### Module Pattern

Every backend module follows the same three-layer structure:

```
routes.js       → defines URL patterns and applies middleware (e.g. upload)
controller.js   → parses request, calls repository, returns response
repository.js   → all SQL queries via prepared statements
```

### Frontend Routing (React Router 7)

| Path | Page | Description |
|------|------|-------------|
| `/` | CatalogPage | Exercise list with sport/subclassification filters |
| `/exercises/:id` | ExerciseDetailPage | Photos, edit, progress chart, recent history |
| `/diary` | DiaryPage | Date selector, session creation, entry logging |
| `/stats` | StatsPage | Activity heatmap + 30-day bar chart |
| `/metrics` | MetricsPage | Metric catalog and unit management |
| `/settings` | SettingsPage | Sports and subclassification management |

### Multi-User Readiness

Every top-level table (`sports`, `subclassifications`, `exercises`, `metrics`, `training_sessions`) contains a nullable `user_id INTEGER` column. It is unused in the MVP but avoids a destructive migration when authentication is added later.

---

## Database Schema

```
sports
  id, name (UNIQUE), user_id, created_at

subclassifications
  id, sport_id → sports, name, user_id, created_at
  UNIQUE(sport_id, name)

exercises
  id, name, description, sport_id → sports, user_id, created_at, updated_at

exercise_subclassifications  (many-to-many)
  exercise_id → exercises (CASCADE), subclassification_id → subclassifications

exercise_photos
  id, exercise_id → exercises (CASCADE), file_path, position, created_at

metrics
  id, name (UNIQUE), user_id, created_at

units
  id, metric_id → metrics, name, abbreviation, created_at
  UNIQUE(metric_id, abbreviation)

exercise_common_metrics  (pre-configured default metrics per exercise)
  exercise_id → exercises (CASCADE), metric_id → metrics,
  default_unit_id → units, position

training_sessions
  id, session_date (TEXT ISO-8601), notes, user_id, created_at

training_entries  (one row = one set)
  id, session_id → training_sessions (CASCADE), exercise_id → exercises,
  difficulty INTEGER CHECK (1–5), notes, entry_order, created_at

entry_metrics  (logged values for an entry)
  id, entry_id → training_entries (CASCADE), metric_id → metrics,
  unit_id → units, value REAL
  UNIQUE(entry_id, metric_id)
```

**Relational integrity notes:**
- Deleting a training session cascades to all its entries and their metrics.
- Deleting an exercise is blocked at the API level (returns `409 Conflict`) if it has any logged training entries, to prevent accidental history loss.
- Sports and subclassifications have no DELETE endpoint by design.

---

## Local Development

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd GymHub
```

```bash
cd backend && npm install
```

```bash
cd ../frontend && npm install
```

### 2. Configure the backend environment

```bash
cp backend/.env.example backend/.env
```

The only required variable is `PORT` (defaults to `4000` if the file is absent).

### 3. Start the backend

```bash
cd backend && npm run dev
```

The API will be available at `http://localhost:4000`. On first start, the database file `backend/sportus.sqlite` is created and seeded automatically.

### 4. Start the frontend

```bash
cd frontend && npm run dev
```

The app opens at `http://localhost:5173`. Vite proxies all `/api` and `/uploads` requests to the backend at `http://localhost:4000`, so no CORS configuration is needed during development.

### Health check

```bash
curl http://localhost:4000/api/health
# → {"status":"ok"}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port the Express server listens on |
| `DB_PATH` | `<backend-root>/sportus.sqlite` | Absolute path to the SQLite file |

---

## API Reference

All endpoints are prefixed with `/api`. Requests and responses use JSON unless noted. Error responses follow the shape `{ "error": "<message>" }`.

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness check |

---

### Sports

Sports cannot be deleted. Subclassifications are always scoped to a sport.

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/sports` | — | List all sports (includes their subclassifications) |
| POST | `/api/sports` | `{ name }` | Create a sport |
| PUT | `/api/sports/:id` | `{ name }` | Rename a sport |

---

### Subclassifications

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/subclassifications` | — | List all subclassifications (optionally `?sport_id=`) |
| POST | `/api/subclassifications` | `{ sport_id, name }` | Create a subclassification |
| PUT | `/api/subclassifications/:id` | `{ name }` | Rename a subclassification |

---

### Exercises

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/exercises` | — | List exercises (optionally `?sport_id=`, `?subclassification_id=`) |
| POST | `/api/exercises` | `{ name, description?, sport_id, subclassification_ids[], common_metrics[] }` | Create an exercise |
| GET | `/api/exercises/:id` | — | Get a single exercise with photos, subclassifications, and common metrics |
| PUT | `/api/exercises/:id` | `{ name?, description?, sport_id?, subclassification_ids[], common_metrics[] }` | Update an exercise |
| DELETE | `/api/exercises/:id` | — | Delete exercise; returns `409` if it has logged entries |
| POST | `/api/exercises/:id/photos` | `multipart/form-data` field `photo` | Upload a photo (see [Image Upload](#image-upload-system)) |
| DELETE | `/api/exercises/:id/photos/:photoId` | — | Remove a photo |
| GET | `/api/exercises/:id/history` | — | Last N sets logged for this exercise |
| GET | `/api/exercises/:id/progress` | — | Time-series data per metric for progress charts |

`common_metrics` array shape:
```json
[{ "metric_id": 1, "default_unit_id": 2, "position": 0 }]
```

---

### Metrics & Units

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/metrics` | — | List all metrics with their units |
| POST | `/api/metrics` | `{ name }` | Create a metric |
| PUT | `/api/metrics/:id` | `{ name }` | Rename a metric |
| GET | `/api/metrics/:metricId/units` | — | List units for a metric |
| POST | `/api/metrics/:metricId/units` | `{ name, abbreviation }` | Add a unit |
| PUT | `/api/metrics/units/:id` | `{ name?, abbreviation? }` | Edit a unit |

---

### Training Sessions & Entries

A **session** is a dated workout. Each **entry** represents one set of an exercise.

| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/training-sessions` | — | List sessions (optionally `?date=YYYY-MM-DD`) |
| POST | `/api/training-sessions` | `{ session_date, notes? }` | Create a session |
| GET | `/api/training-sessions/:id` | — | Get session with all entries and their metrics |
| DELETE | `/api/training-sessions/:id` | — | Delete session and all its entries |
| POST | `/api/training-sessions/:id/entries` | `{ exercise_id, difficulty, notes?, entry_order?, metrics[] }` | Log a set |
| PUT | `/api/training-sessions/:id/entries/:entryId` | `{ difficulty?, notes?, metrics[] }` | Update a set |
| DELETE | `/api/training-sessions/:id/entries/:entryId` | — | Remove a set |

`metrics` array shape for entries:
```json
[{ "metric_id": 1, "unit_id": 2, "value": 20 }]
```

`difficulty` is an integer from `1` (very difficult) to `5` (very easy), enforced at both the API and database level.

---

### Stats

| Method | Path | Query params | Description |
|--------|------|-------------|-------------|
| GET | `/api/stats/heatmap` | `?days=365` (default 365) | Daily session counts for the activity heatmap |
| GET | `/api/stats/activity` | `?days=30` (default 30) | Entry counts per day for the bar chart |

Heatmap response shape:
```json
[{ "date": "2026-09-01", "count": 3 }, ...]
```

---

## Image Upload System

Photos are uploaded as `multipart/form-data` to `POST /api/exercises/:id/photos` using the field name `photo`.

**Constraints enforced by the server:**

| Property | Limit |
|----------|-------|
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `image/gif` |
| Maximum file size | 5 MB |

**Storage:**
- Files are saved to `backend/uploads/` on the server's filesystem.
- The original filename is discarded; a UUID + original extension is used instead (e.g. `3f2504e0-4f89-11d3-9a0c-0305e82c3301.jpg`).
- Only the relative path is stored in the `exercise_photos` table.
- Files are served statically at `/uploads/<filename>`.

**Frontend usage:**
- In development, Vite proxies `/uploads/*` to `http://localhost:4000/uploads/*`.
- In production, point the static file server or CDN at the same `/uploads` path.

**Example upload with curl:**
```bash
curl -X POST http://localhost:4000/api/exercises/1/photos \
  -F "photo=@/path/to/image.jpg"
```

---

## Seed Data

The database is seeded automatically on first start (when the `sports` table is empty):

**Sports & Subclassifications:**

| Sport | Subclassifications |
|-------|--------------------|
| Gym | Biceps, Triceps, Chest, Back, Shoulders, Cardio, Abs, Glutes, Quads, Calves |
| Basketball | Ball Handling, Shooting Mechanics, Defense, Conditioning, Off-ball Movement |

**Metrics & Units:**

| Metric | Units |
|--------|-------|
| Weight | Kilograms (kg), Pounds (lb) |
| Repetitions | Reps (reps) |
| Time | Seconds (sec), Minutes (min) |
| Distance | Meters (m), Kilometers (km) |
| Calories | Kilocalories (kcal) |
| Heart Rate | Beats per minute (bpm) |
| Height | Centimeters (cm) |

---

## Future Roadmap

| Phase | Description |
|-------|-------------|
| Phase 2 | Enhanced metrics & charts (custom metric types, advanced aggregations, more chart variants) |
| Phase 3 | Multi-user upgrade (activate `user_id` columns, JWT authentication, per-user data isolation) |
| Phase 4 | Social features (sharing workouts, following other users, public profiles) |
| Phase 5 | AI features (workout suggestions, progress analysis, anomaly detection) |
