-- Add Race to photo categories (run after 001_photos.sql).
ALTER TYPE photo_category ADD VALUE IF NOT EXISTS 'RACE';
