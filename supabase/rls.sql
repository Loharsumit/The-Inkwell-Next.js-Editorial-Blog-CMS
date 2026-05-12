-- ─────────────────────────────────────────────────────────────────────────
-- The Inkwell — Row Level Security Policies
-- Run AFTER schema.sql in your Supabase project: Dashboard → SQL Editor
-- ─────────────────────────────────────────────────────────────────────────

-- ── Profiles ─────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles (for author info on posts)
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (TRUE);

-- Users can only update their own profile
CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Posts ─────────────────────────────────────────────────────────────────
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public can read published posts only
CREATE POLICY "posts_public_read"
  ON public.posts FOR SELECT
  USING (published = TRUE OR auth.uid() = author_id);

-- Authors can create their own posts
CREATE POLICY "posts_author_insert"
  ON public.posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Authors can update only their own posts
CREATE POLICY "posts_author_update"
  ON public.posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Authors can delete only their own posts
CREATE POLICY "posts_author_delete"
  ON public.posts FOR DELETE
  USING (auth.uid() = author_id);
