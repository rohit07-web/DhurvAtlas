begin;
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  source_resource_id uuid not null references public.resources(id) on delete restrict,
  title text not null check (length(trim(title)) between 1 and 200),
  excerpt text not null default '' check (length(excerpt) <= 500),
  body text not null default '' check (length(body) <= 30000),
  byline text not null default '' check (length(byline) <= 120),
  publication_status text not null default 'draft' check (publication_status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (publication_status = 'draft' or (length(trim(body)) >= 80 and length(trim(excerpt)) >= 10 and length(trim(byline)) > 0))
);
create index stories_source_idx on public.stories(source_resource_id);
alter table public.stories enable row level security;
grant select on public.stories to anon, authenticated;
grant insert,update,delete on public.stories to authenticated;
create policy "Readers see published stories with published sources" on public.stories
  for select to anon, authenticated using (
    publication_status = 'published' and exists (
      select 1 from public.resources r where r.id = source_resource_id and r.publication_status = 'published'
    )
  );
create policy "Approved administrators manage stories" on public.stories
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create trigger stories_updated_at before update on public.stories
  for each row execute function public.handle_updated_at();
create function public.withdraw_source_stories() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.publication_status <> 'published' and old.publication_status = 'published' then
    update public.stories set publication_status = 'draft' where source_resource_id = new.id;
  end if;
  return new;
end; $$;
revoke all on function public.withdraw_source_stories() from public;
create trigger withdraw_source_stories after update of publication_status on public.resources
  for each row execute function public.withdraw_source_stories();
commit;
