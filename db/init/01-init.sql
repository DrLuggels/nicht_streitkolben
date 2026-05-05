-- Wird beim ersten Postgres-Start ausgeführt.
-- Drizzle übernimmt das Schema; hier nur Erweiterungen.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
