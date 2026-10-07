# BengaluruFlow

**Smarter Roads. Faster Response.** A full-stack portfolio prototype exploring simulated traffic awareness and emergency route coordination for Bengaluru.

## Problem

Urban operators need a shared view of congestion, reported incidents, and priority response routes. BengaluruFlow models that workflow with a small, explainable set of demo corridors rather than claiming access to live traffic feeds.

## Features

- Responsive, single-page traffic operations interface with corridor status, clickable simulated map, incident reporting, route analysis, and illustrative analytics.
- Layered Spring REST API with DTO validation, JPA persistence, BCrypt passwords, stateless JWT, role-gated operator writes, global error responses, and OpenAPI UI.
- Seed data for Bengaluru traffic zones and incidents; H2-backed HTTP integration tests.
- MySQL-ready local profile and Postman collection.

All traffic/ETA/analytics, hospital, and vehicle data is simulated. The map is illustrative and must not be used for navigation or real emergency dispatch.

## Architecture

The React/Vite client calls the backend through `frontend/src/fron2/api.ts`; clearly marked local demo data keeps traffic panels inspectable while the API is offline. `frontend/src/fron1/TrafficMap.tsx` owns the SVG corridor view.

The Maven app at `backend/backend1` follows controller → service → repository → entity boundaries, with API records in `dto`, JWT handling in `security`, configuration/seeding in `config`, and centralized error mapping in `exception`. The route planner compares a few candidate paths with `delay + congestion / 12` per zone. The separate `backend/backend2` directory stores API test material, not a second server.

## Technology

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, Lucide React
- Backend: Java 21, Spring Boot 4, Spring Web MVC, Spring Security, Spring Data JPA, Hibernate, Bean Validation, Maven
- Data/API: MySQL 8, H2 test profile, JWT (JJWT), springdoc OpenAPI

## Data model

JPA-managed tables: `app_users`, `traffic_zones`, `traffic_incidents`, and `emergency_requests`. Hospital and vehicle endpoints currently return fixed simulated reference data. `database/schema.sql` creates the database; Hibernate creates local prototype tables. Use a versioned migration tool before production.

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- Java 21 or newer
- MySQL 8, or the included H2 test profile

Maven is supplied by the backend Maven wrapper; a global Maven install is not required.

## MySQL setup

Create a local database with `database/schema.sql`, or start a local MySQL 8 container where Docker is available. Copy `.env.example` to `.env` for reference, then set these variables in the backend process environment (Spring does not automatically load the root `.env`):

- `DB_URL` (defaults to `jdbc:mysql://localhost:3306/bengaluruflow?...`)
- `DB_USERNAME` (defaults to `root`)
- `DB_PASSWORD` (required for your local MySQL account)
- `JWT_SECRET` (set a unique random value with at least 32 characters)
- `JWT_EXPIRATION_MS` (defaults to 86400000)

Do not commit `.env` or production secrets. `.env.example` contains placeholders only.

## Run backend (PowerShell)

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "your-local-mysql-password"
$env:JWT_SECRET = "replace-with-a-unique-random-secret-of-32-chars-or-more"
Set-Location backend/backend1
./mvnw.cmd spring-boot:run
```

For an ephemeral local database, run with the test profile instead: `./mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=test`.

## Run frontend

In another terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Vite prints the local URL, typically `http://localhost:5173`. Set `VITE_API_BASE_URL` before starting Vite to point to another API origin. The UI labels offline content as demo mode and does not persist a report unless the API is reachable.

## API documentation

Open `http://localhost:8080/swagger-ui.html` after starting the backend. The concise endpoint list and request examples are in [docs/API.md](docs/API.md). The architecture and route-cost explanation are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). A Postman collection is in `backend/backend2`.

Key endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/traffic/zones`, `POST /api/incidents`, `POST /api/emergency/request`, `GET /api/hospitals`, `POST /api/routes/optimize`, `GET /api/analytics/traffic`, and `GET /api/analytics/incidents`.

## Authentication and test credentials

Register any user with a valid email and password of at least eight characters. The Postman demo user is `portfolio@example.com` / `TrafficDemo42` when registered against a fresh database. No account is pre-seeded. Registration always grants `ROLE_USER`; promote a local account to `ROLE_OPERATOR` with `UPDATE app_users SET role = 'ROLE_OPERATOR' WHERE email = 'operator@example.com';` to test protected mutations. Never use demo credentials outside a disposable local database.

## Tests

```powershell
Set-Location backend/backend1
./mvnw.cmd test
```

The tests use H2 and MockMvc to check seeded reads, incident persistence, route scoring, register/login, and role-based denial. Frontend typecheck and production bundle: `npm run build` from `frontend`.

## Screenshots

Suggested portfolio captures: desktop overview/hero; traffic cards and map with a selected zone; emergency route after optimization; incident form beside the recent feed; narrow mobile navigation and stacked incident form. Save captures under `docs/screenshots/` after running the app.

## Limitations and next steps

- There is no live traffic provider, geographic road graph, turn-by-turn directions, or real dispatch integration.
- Hospitals and fleet entries are illustrative in-memory reference data; traffic zones, users, incidents, and emergency requests use JPA.
- The public UI currently focuses on the community/operations overview. A dedicated authenticated operator workspace, user-facing login controls, and CRUD screens for every admin resource remain follow-up work.
- Local schema evolution uses Hibernate `ddl-auto=update`; use Flyway/Liquibase, secret rotation, audit logging, rate limiting, and deployment hardening before production.
- Add a real map/traffic provider, route graph, operational data agreements, and accessibility/usability validation before any real-world use.
