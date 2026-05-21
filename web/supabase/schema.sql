-- AI Dev Team — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New query → Paste & Run

-- ── Projects ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  description   TEXT        NOT NULL DEFAULT '',
  sdlc_phase    TEXT        NOT NULL DEFAULT 'plan',
  git_url       TEXT,
  active_personas TEXT[]    NOT NULL DEFAULT '{}',
  created_by    TEXT        NOT NULL DEFAULT 'anonymous',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Personas ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS personas (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  role          TEXT        NOT NULL,
  display_name  TEXT        NOT NULL,
  system_prompt TEXT        NOT NULL DEFAULT '',
  can_do        TEXT[]      NOT NULL DEFAULT '{}',
  cannot_do     TEXT[]      NOT NULL DEFAULT '{}',
  delegate_to   TEXT,
  is_default    BOOLEAN     NOT NULL DEFAULT false,
  created_by    TEXT        NOT NULL DEFAULT 'anonymous',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Auto-update updated_at ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER personas_updated_at
  BEFORE UPDATE ON personas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS: disable for service role access ─────────────────────────────────────
-- The web dashboard uses SUPABASE_SERVICE_ROLE_KEY (server-side only),
-- which bypasses RLS automatically. No policies needed.
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE personas DISABLE ROW LEVEL SECURITY;
