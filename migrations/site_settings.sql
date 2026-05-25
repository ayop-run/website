-- Generic key/value store for editable site settings.
-- Used today for the members benefits password; extend as needed.

create table if not exists site_settings (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now()
);

-- Seed the benefits member password with the previous hardcoded value so
-- existing sessions keep working after the migration. Change it from
-- /admin/benefits at any time.
insert into site_settings (key, value)
values ('benefits_member_password', 'ayoprun2024')
on conflict (key) do nothing;
