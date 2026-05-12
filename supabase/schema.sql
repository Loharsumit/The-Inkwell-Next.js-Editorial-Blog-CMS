-- ─────────────────────────────────────────────────────────────────────────
-- The Inkwell — Supabase Database Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────

-- Enable UUID extension (already enabled on Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Profiles ─────────────────────────────────────────────────────────────
-- Extends the built-in auth.users table with public profile data.
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  username    TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically create a profile record when a new user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Posts ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id                  UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title               TEXT        NOT NULL,
  slug                TEXT        NOT NULL UNIQUE,
  content_md          TEXT        NOT NULL DEFAULT '',
  excerpt             TEXT,
  cover_image         TEXT,
  published           BOOLEAN     NOT NULL DEFAULT FALSE,
  author_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tags                TEXT[],
  read_time_minutes   INTEGER
);

-- Auto-update the updated_at timestamp on every row change.
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_updated_at ON public.posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();

-- Index for fast slug lookups (used by SSG and the blog post page)
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_idx ON public.posts(slug);

-- Index for filtering published posts by author
CREATE INDEX IF NOT EXISTS posts_author_published_idx
  ON public.posts(author_id, published);

-- Index for tag array searches
CREATE INDEX IF NOT EXISTS posts_tags_idx ON public.posts USING GIN(tags);
