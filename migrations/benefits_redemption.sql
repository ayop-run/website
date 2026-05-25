-- Add a single redemption tag to each benefit: 'online', 'in_store', or 'both'.
-- Safe to re-run.

alter table benefits
  add column if not exists redemption text not null default 'online';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'benefits_redemption_check'
  ) then
    alter table benefits
      add constraint benefits_redemption_check
      check (redemption in ('online', 'in_store', 'both'));
  end if;
end $$;

-- Backfill: existing QR-voucher rows are in-store by default.
update benefits
  set redemption = 'in_store'
  where kind = 'qr' and redemption = 'online';

create index if not exists idx_benefits_redemption on benefits (redemption);
