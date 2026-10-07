CREATE DATABASE IF NOT EXISTS bengaluruflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

-- Hibernate creates and evolves the application tables on startup in this portfolio prototype.
-- Do not use ddl-auto=update as a production migration strategy.