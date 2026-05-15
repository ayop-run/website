-- Optional direct URL for album card cover image (run in Supabase SQL Editor).
ALTER TABLE photos ADD COLUMN IF NOT EXISTS cover_image_url text;
