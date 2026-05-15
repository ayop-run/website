-- Run in Supabase SQL Editor (or supabase db push)
CREATE TYPE photo_category AS ENUM ('TRACK_SESSION', 'SPECIAL_RUN');

CREATE TABLE IF NOT EXISTS photos (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  external_album_url text NOT NULL,
  shot_on date NOT NULL,
  category photo_category NOT NULL,
  photographer_display_name text,
  photographer_instagram_username text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT photos_id_shape CHECK (id ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]{6,10}$')
);

CREATE INDEX IF NOT EXISTS idx_photos_shot_on ON photos (shot_on DESC);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos (category);
