# Architecture

## Runtime boundaries

- `frontend/` is a Vite + React + TypeScript single-page experience. `src/fron1/` contains the map visualization; `src/fron2/` owns REST calls and demo fallback data.
- `backend/backend1/` is the Spring Boot 4 / Java 21 application. Controllers handle HTTP only; services own business rules; repositories own persistence; DTO records isolate API contracts from JPA entities.
- `backend/backend2/` contains API client and smoke-test material.
- `database/` contains MySQL bootstrap assets. Hibernate creates the demo schema for local development; production deployments should use versioned migrations.

## Backend packages

`controller`, `service`, `repository`, `entity`, `dto`, `security`, `config`, and `exception` form the main application layers. JWT access tokens are stateless, passwords are BCrypt-hashed, and operator/admin writes are role-gated. Self-registration only grants `ROLE_USER`; operators must be promoted out-of-band.

## Route selection

The planner compares a small set of named sample corridors. For each traversed traffic zone it adds the configured delay and a congestion penalty (`delayMinutes + congestion / 12`). The lowest-cost route wins. It is an explainable portfolio heuristic, not a road graph, navigation engine, or emergency dispatch system.

## Data and trust boundaries

All traffic, ETA, analytics, corridor, hospital, and fleet values in this prototype are fictional/demo values. The SVG map is illustrative and not navigational. The public incident form persists only when the backend is reachable. No third-party live traffic provider is integrated.

## Local testing

`application-test.properties` uses an in-memory H2 database in MySQL compatibility mode. The test suite drives HTTP routes through MockMvc and verifies stored reports, request creation, JWT issue/login, and role denial without requiring a MySQL password.
