-- Apply AFTER 20260930_init_dhruv_atlas.sql. No administrator is seeded.
begin;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on public.admin_users from anon, authenticated;
grant select on public.admin_users to authenticated;
drop policy if exists "Read own admin membership" on public.admin_users;
create policy "Read own admin membership" on public.admin_users for select to authenticated using(user_id = auth.uid());
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
alter table public.resources add column if not exists approved_summary text;
alter table public.ai_drafts add column if not exists source_basis text;

drop policy if exists "Only authenticated admins can manage stations" on public.stations;
drop policy if exists "Only authenticated admins can manage expeditions" on public.expeditions;
drop policy if exists "Authenticated admins can view all resources" on public.resources;
drop policy if exists "Authenticated admins can insert resources" on public.resources;
drop policy if exists "Authenticated admins can update resources" on public.resources;
drop policy if exists "Authenticated admins can delete resources" on public.resources;
drop policy if exists "Authenticated admins can access ai_drafts" on public.ai_drafts;
drop policy if exists "Authenticated admins can upload archive files" on storage.objects;
drop policy if exists "Authenticated admins can read archive files" on storage.objects;
drop policy if exists "Approved admins manage resources" on public.resources;
create policy "Approved admins manage resources" on public.resources for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
drop policy if exists "Approved admins manage stations" on public.stations;
create policy "Approved admins manage stations" on public.stations for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
drop policy if exists "Approved admins manage expeditions" on public.expeditions;
create policy "Approved admins manage expeditions" on public.expeditions for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
drop policy if exists "Approved admins manage AI drafts" on public.ai_drafts;
create policy "Approved admins manage AI drafts" on public.ai_drafts for all to authenticated using((select public.is_admin())) with check((select public.is_admin()));
drop policy if exists "Approved admins manage archive objects" on storage.objects;
create policy "Approved admins manage archive objects" on storage.objects for all to authenticated using(bucket_id = 'polar_archive' and (select public.is_admin())) with check(bucket_id = 'polar_archive' and (select public.is_admin()));
-- Existing public resource and linked-object read policies only expose published records.
update storage.buckets set public = false, file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf','text/plain','text/csv','image/png','image/jpeg','image/webp','video/mp4']
where id = 'polar_archive';
grant select on public.resources, public.stations, public.expeditions to anon, authenticated;
grant insert,update,delete on public.resources, public.stations, public.expeditions to authenticated;
grant select,insert,update,delete on public.ai_drafts to authenticated;

create table if not exists public.ai_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_start timestamptz not null,
  requests integer not null
);
alter table public.ai_rate_limits enable row level security;
revoke all on public.ai_rate_limits from anon, authenticated;
create or replace function public.claim_ai_slot() returns boolean
language plpgsql security definer set search_path = '' as $$
declare used integer;
begin
  if not public.is_admin() then return false; end if;
  insert into public.ai_rate_limits(user_id,window_start,requests)
  values(auth.uid(),date_trunc('minute',now()),1)
  on conflict(user_id) do update set
    requests = case when ai_rate_limits.window_start = date_trunc('minute',now()) then ai_rate_limits.requests + 1 else 1 end,
    window_start = date_trunc('minute',now())
  returning requests into used;
  return used <= 5;
end; $$;
revoke all on function public.claim_ai_slot() from public;
grant execute on function public.claim_ai_slot() to authenticated;
commit;
