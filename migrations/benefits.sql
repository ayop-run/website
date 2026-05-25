-- Run in Supabase SQL Editor (or `supabase db push`).
-- Creates the `benefits` table that powers the /benefits/perks page.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'benefit_kind') then
    create type benefit_kind as enum ('code', 'qr');
  end if;
end $$;

create table if not exists benefits (
  id              uuid primary key default gen_random_uuid(),
  brand           text not null,
  description     text,
  kind            benefit_kind not null default 'code',
  discount_code   text,
  qr_image_url    text,
  locations       text[] not null default '{}',
  discount_value  text not null,
  category        text not null,
  store_url       text not null,
  expires_at      date,
  display_order   integer not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint benefits_kind_consistent check (
    (kind = 'code' and discount_code is not null and length(trim(discount_code)) > 0)
    or
    (kind = 'qr' and qr_image_url is not null and length(trim(qr_image_url)) > 0)
  )
);

create index if not exists idx_benefits_display
  on benefits (display_order asc, created_at desc);

create index if not exists idx_benefits_published
  on benefits (is_published);

-- Optional: seed the table with the previous hardcoded list.
-- Comment out if you'd rather start empty and add via /admin/benefits.
insert into benefits (brand, description, kind, discount_code, discount_value, category, store_url, expires_at)
values
  ('ON Running', 'Premium Swiss performance running shoes and apparel', 'code', 'AYOP20', '20% off', 'Footwear', 'https://www.on-running.com', '2026-12-31'),
  ('Maurten', 'Revolutionary hydrogel sports fuel technology', 'code', 'AYOPFUEL15', '15% off', 'Nutrition', 'https://www.maurten.com', '2026-09-30'),
  ('Tracksmith', 'Timeless running apparel crafted for the dedicated runner', 'code', 'AYOPTRACK25', '25% off', 'Apparel', 'https://www.tracksmith.com', '2026-08-15'),
  ('Coros', 'Advanced GPS watches and heart rate monitors', 'code', 'AYOPCOROS10', '10% off', 'Tech', 'https://www.coros.com', null),
  ('Nuun', 'Clean electrolyte hydration tablets', 'code', 'AYOPNUUN20', '20% off', 'Nutrition', 'https://www.nuunlife.com', '2026-07-01'),
  ('Goodr', 'Fun, functional, and fashionable running sunglasses', 'code', 'AYOPSHADES15', '15% off', 'Accessories', 'https://www.goodr.com', '2026-10-31'),
  ('Satisfy Running', 'High-performance technical running gear with style', 'code', 'AYOPSATISFY20', '20% off', 'Apparel', 'https://www.satisfyrunning.com', '2026-11-30')
on conflict do nothing;

insert into benefits (brand, description, kind, qr_image_url, locations, discount_value, category, store_url, expires_at)
values
  ('Five Elephant', 'Berlin specialty coffee roaster and bakery, beloved for filter coffee and cheesecake.', 'qr', '/images/five-elephants-discount-code.jpg', ARRAY['Kollwitzstraße', 'Schwedter Straße'], '15% off', 'Café', 'https://fiveelephant.com', null)
on conflict do nothing;
