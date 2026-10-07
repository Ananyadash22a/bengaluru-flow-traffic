# API Reference

Base URL: `http://localhost:8080/api`

Interactive OpenAPI UI: `http://localhost:8080/swagger-ui.html`

| Method | Path                       | Access         | Purpose                                                  |
| ------ | -------------------------- | -------------- | -------------------------------------------------------- |
| POST   | `/auth/register`           | Public         | Create a `ROLE_USER` account and return a JWT            |
| POST   | `/auth/login`              | Public         | Verify credentials and return a JWT                      |
| GET    | `/traffic/zones`           | Public         | List seeded simulated traffic zones                      |
| GET    | `/traffic/zones/{id}`      | Public         | Read one zone                                            |
| PUT    | `/traffic/zones/{id}`      | Operator/Admin | Update congestion, speed, and delay                      |
| GET    | `/incidents`               | Public         | List incidents                                           |
| POST   | `/incidents`               | Public         | Validate and store a report                              |
| PUT    | `/incidents/{id}`          | Operator/Admin | Update severity and status                               |
| DELETE | `/incidents/{id}`          | Operator/Admin | Delete an incident                                       |
| GET    | `/emergency/vehicles`      | Public         | List simulated emergency units                           |
| POST   | `/emergency/request`       | Public         | Score a route and persist an emergency request           |
| GET    | `/emergency/requests/{id}` | Authenticated  | Read a saved request                                     |
| GET    | `/hospitals`               | Public         | List demo hospitals                                      |
| GET    | `/routes`                  | Public         | List sample corridors                                    |
| POST   | `/routes/optimize`         | Public         | Compare candidate routes using simulated traffic weights |
| GET    | `/analytics/traffic`       | Public         | Return demo zone and daily traffic metrics               |
| GET    | `/analytics/incidents`     | Public         | Return incident counts by type                           |

Protected requests use `Authorization: Bearer <token>`. Register and login accept `{ "email": "name@example.com", "password": "at-least-8-chars" }`. Promoting a verified local account to operator requires a database action, for example `UPDATE app_users SET role = 'ROLE_OPERATOR' WHERE email = 'operator@example.com';`.

Incident reports use `{ "type": "Accident", "location": "Marathahalli Bridge", "severity": "HIGH", "description": "Vehicle collision blocking the left lane." }`.

Route optimization uses `{ "origin": "Whitefield", "destination": "Manipal Hospital", "priority": "HIGH" }` and returns an estimated route with `simulated: true`.
