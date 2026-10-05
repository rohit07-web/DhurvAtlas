-- FOR A NEW, EMPTY DHRUV ATLAS PROJECT ONLY. Run once.
begin;
-- ==============================================================================
-- DHRUV ATLAS: DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Target: PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE resource_type_enum AS ENUM ('report', 'dataset', 'image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE publication_status_enum AS ENUM ('draft', 'in_review', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. TABLES
-- ------------------------------------------------------------------------------

-- Stations Table
CREATE TABLE IF NOT EXISTS public.stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    region TEXT NOT NULL,
    description TEXT,
    coordinates TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Expeditions Table
CREATE TABLE IF NOT EXISTS public.expeditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    station_id UUID REFERENCES public.stations(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type resource_type_enum NOT NULL DEFAULT 'report',
    expedition_id UUID REFERENCES public.expeditions(id) ON DELETE SET NULL,
    description TEXT,
    source_url TEXT,
    file_path TEXT,
    publication_status publication_status_enum NOT NULL DEFAULT 'draft',
    doi TEXT,
    authors TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Drafts Table
CREATE TABLE IF NOT EXISTS public.ai_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    suggested_summary TEXT NOT NULL,
    key_takeaways JSONB DEFAULT '[]'::jsonb NOT NULL,
    suggested_tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    social_caption TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal querying
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(publication_status);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_expedition ON public.resources(expedition_id);
CREATE INDEX IF NOT EXISTS idx_ai_drafts_resource ON public.ai_drafts(resource_id);

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_resources_updated_at ON public.resources;
CREATE TRIGGER trigger_resources_updated_at
    BEFORE UPDATE ON public.resources
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 3. STORAGE BUCKET CONFIGURATION (polar_archive)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('polar_archive', 'polar_archive', false)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expeditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_drafts ENABLE ROW LEVEL SECURITY;

-- STATIONS POLICIES
-- Anyone can view research stations (public discovery)
CREATE POLICY "Public stations are viewable by everyone" 
ON public.stations FOR SELECT 
USING (true);

-- Only authenticated administrators can modify stations
CREATE POLICY "Only authenticated admins can manage stations" 
ON public.stations FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- EXPEDITIONS POLICIES
-- Anyone can view expeditions (public discovery)
CREATE POLICY "Public expeditions are viewable by everyone" 
ON public.expeditions FOR SELECT 
USING (true);

-- Only authenticated administrators can modify expeditions
CREATE POLICY "Only authenticated admins can manage expeditions" 
ON public.expeditions FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- RESOURCES POLICIES (Crucial Security Requirement)
-- Anonymous users can ONLY SELECT published resources
CREATE POLICY "Published resources are viewable by everyone" 
ON public.resources FOR SELECT 
USING (publication_status = 'published');

-- Authenticated users (admins) can view ALL resources (including drafts and in_review)
CREATE POLICY "Authenticated admins can view all resources" 
ON public.resources FOR SELECT 
TO authenticated 
USING (true);

-- Only authenticated admins can insert resources
CREATE POLICY "Authenticated admins can insert resources" 
ON public.resources FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Only authenticated admins can update resources (e.g. state transitions)
CREATE POLICY "Authenticated admins can update resources" 
ON public.resources FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Only authenticated admins can delete resources
CREATE POLICY "Authenticated admins can delete resources" 
ON public.resources FOR DELETE 
TO authenticated 
USING (true);

-- AI_DRAFTS POLICIES
-- AI drafts are strictly private to authenticated administrators
CREATE POLICY "Authenticated admins can access ai_drafts" 
ON public.ai_drafts FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- STORAGE POLICIES (polar_archive)
-- Authenticated admins can upload files to polar_archive
CREATE POLICY "Authenticated admins can upload archive files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'polar_archive');

-- Authenticated admins can read all files in polar_archive
CREATE POLICY "Authenticated admins can read archive files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'polar_archive');

-- Public users can only read storage objects linked to published resources
CREATE POLICY "Public can view published archive files"
ON storage.objects FOR SELECT
TO public
USING (
    bucket_id = 'polar_archive' AND
    EXISTS (
        SELECT 1 FROM public.resources 
        WHERE resources.file_path = storage.objects.name 
        AND resources.publication_status = 'published'
    )
);

-- ------------------------------------------------------------------------------
-- 5. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.stations (id, name, region, description, coordinates)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Maitri Station', 'Antarctica', 'Permanent year-round research station in Schirmacher Oasis.', '70°45′S 11°44′E'),
    ('22222222-2222-2222-2222-222222222222', 'Bharati Station', 'Antarctica', 'Modern coastal polar station located in Larsemann Hills.', '69°24′S 76°11′E'),
    ('33333333-3333-3333-3333-333333333333', 'Himadri Station', 'Arctic', 'Indian Arctic research station at Ny-Ålesund, Svalbard archipelago.', '78°55′N 11°56′E'),
    ('44444444-4444-4444-4444-444444444444', 'Himansh Field Base', 'Himalaya', 'High-altitude observatory in Chandra Basin, Western Himalaya.', '32°17′N 77°35′E')
ON CONFLICT (name) DO NOTHING;

-- Expedition entries must be supplied and checked by the project owner.

-- Apply AFTER 20260930_init_dhruv_atlas.sql. No administrator is seeded.

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
