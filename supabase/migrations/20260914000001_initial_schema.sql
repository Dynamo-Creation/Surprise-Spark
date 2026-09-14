-- ==============================================================================
-- SURPRISESPARK: DATABASE SCHEMA MIGRATION (PHASE 2)
-- Architecture: Template Engine + Scene Engine + Asset Engine + Personalization Engine
-- ==============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USER PROFILES
-- Associated with authenticated Supabase users (auth.users).
-- Passwords are strictly managed by Supabase Auth; never stored here.
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES
-- Extensible categories for celebration experiences.
-- Initial active launch category: Birthday & Celebrations.
-- ------------------------------------------------------------------------------
create table if not exists public.categories (
  id text primary key, -- e.g. 'birthday', 'love', 'anniversary'
  name text not null,
  description text not null,
  icon_name text not null default 'Sparkles',
  badge_color text not null,
  accent_color text not null,
  is_active boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- ------------------------------------------------------------------------------
-- 3. THEMES
-- Visual aesthetic tokens (colors, gradients, ambient lighting presets).
-- ------------------------------------------------------------------------------
create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  primary_color text not null,
  secondary_color text not null,
  accent_color text not null,
  background_gradient text not null,
  font_family text not null default 'sans',
  css_tokens jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.themes enable row level security;

-- ------------------------------------------------------------------------------
-- 4. MUSIC TRACKS
-- Royalty-free audio tracks for surprise background ambiance.
-- ------------------------------------------------------------------------------
create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default 'Original Score',
  duration_seconds int not null default 120,
  audio_url text not null,
  category_id text references public.categories(id) on delete set null,
  is_royalty_free boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.music_tracks enable row level security;

-- ------------------------------------------------------------------------------
-- 5. TEMPLATES
-- Experience templates powering the Template Engine.
-- ------------------------------------------------------------------------------
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category_id text not null references public.categories(id) on delete restrict,
  description text not null,
  tagline text not null,
  thumbnail_url text,
  cover_gradient text not null default 'from-pink-500 to-purple-600',
  default_theme_id uuid references public.themes(id) on delete set null,
  default_music_id uuid references public.music_tracks(id) on delete set null,
  is_featured boolean not null default false,
  is_premium boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.templates enable row level security;

-- ------------------------------------------------------------------------------
-- 6. TEMPLATE VERSIONS
-- Version history and changelogs for template updates.
-- ------------------------------------------------------------------------------
create table if not exists public.template_versions (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  version_number text not null,
  changelog text,
  manifest jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  unique(template_id, version_number)
);

alter table public.template_versions enable row level security;

-- ------------------------------------------------------------------------------
-- 7. SCENES
-- Sequence steps (gift box intro, candle cake blow, polaroid gallery, fireworks).
-- ------------------------------------------------------------------------------
create table if not exists public.scenes (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  scene_type text not null, -- 'intro-gift-box', 'cake-candles', 'photo-gallery', 'confetti-explosion', 'letter-reveal'
  sequence_order int not null default 1,
  title text not null,
  subtitle text,
  default_text text,
  duration_ms int default 0,
  background_theme text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.scenes enable row level security;

-- ------------------------------------------------------------------------------
-- 8. ASSETS & ASSET VERSIONS
-- 3D GLB/GLTF models, textures, particle shaders, and Lottie animations.
-- ------------------------------------------------------------------------------
create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  asset_type text not null, -- 'model3d', 'texture', 'audio', 'particles', 'lottie'
  category text not null default 'general',
  storage_path text not null,
  file_size_bytes bigint,
  mime_type text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.assets enable row level security;

create table if not exists public.asset_versions (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets(id) on delete cascade,
  version text not null default '1.0.0',
  storage_path text not null,
  changelog text,
  created_at timestamptz not null default now(),
  unique(asset_id, version)
);

alter table public.asset_versions enable row level security;

-- ------------------------------------------------------------------------------
-- 9. ASSET SLOTS & TEMPLATE ASSET ASSIGNMENTS
-- Modular binding between templates and interchangeable 3D assets.
-- ------------------------------------------------------------------------------
create table if not exists public.asset_slots (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  slot_name text not null, -- e.g. 'primary_gift_box', 'cake_model', 'candle_particle'
  required_type text not null,
  default_asset_id uuid references public.assets(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(template_id, slot_name)
);

alter table public.asset_slots enable row level security;

create table if not exists public.template_asset_assignments (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.templates(id) on delete cascade,
  slot_id uuid not null references public.asset_slots(id) on delete cascade,
  asset_id uuid not null references public.assets(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(template_id, slot_id)
);

alter table public.template_asset_assignments enable row level security;

-- ------------------------------------------------------------------------------
-- 10. SCENE OBJECTS & SCENE TRIGGERS
-- Scene node hierarchy, transforms, and interaction triggers.
-- ------------------------------------------------------------------------------
create table if not exists public.scene_objects (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  object_type text not null, -- 'mesh', 'light', 'camera_target', 'particle_emitter'
  position jsonb not null default '[0, 0, 0]'::jsonb,
  rotation jsonb not null default '[0, 0, 0]'::jsonb,
  scale jsonb not null default '[1, 1, 1]'::jsonb,
  asset_id uuid references public.assets(id) on delete set null,
  props jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.scene_objects enable row level security;

create table if not exists public.scene_triggers (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references public.scenes(id) on delete cascade,
  trigger_type text not null, -- 'tap', 'mic_blow', 'time_elapsed', 'scroll'
  action text not null, -- 'next_scene', 'play_sound', 'explode_confetti', 'extinguish_candle'
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.scene_triggers enable row level security;

-- ------------------------------------------------------------------------------
-- 11. SURPRISES
-- Core experience created by a user for a recipient.
-- ------------------------------------------------------------------------------
create table if not exists public.surprises (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  category_id text not null references public.categories(id) on delete restrict,
  title text not null,
  recipient_name text not null,
  recipient_relationship text,
  recipient_birthdate date,
  sender_name text not null,
  custom_message text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived', 'expired')),
  view_count int not null default 0,
  unwrapped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_surprises_public_id on public.surprises(public_id);
create index if not exists idx_surprises_user_id on public.surprises(user_id);
create index if not exists idx_surprises_status on public.surprises(status);

alter table public.surprises enable row level security;

-- ------------------------------------------------------------------------------
-- 12. SURPRISE PHOTOS
-- User-uploaded photo memories for constellation / polaroid scenes.
-- ------------------------------------------------------------------------------
create table if not exists public.surprise_photos (
  id uuid primary key default gen_random_uuid(),
  surprise_id uuid not null references public.surprises(id) on delete cascade,
  storage_path text not null,
  caption text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_surprise_photos_surprise_id on public.surprise_photos(surprise_id);

alter table public.surprise_photos enable row level security;

-- ------------------------------------------------------------------------------
-- 13. SURPRISE SETTINGS
-- Per-surprise audio, interaction, and styling overrides.
-- ------------------------------------------------------------------------------
create table if not exists public.surprise_settings (
  id uuid primary key default gen_random_uuid(),
  surprise_id uuid not null unique references public.surprises(id) on delete cascade,
  theme_id uuid references public.themes(id) on delete set null,
  music_track_id uuid references public.music_tracks(id) on delete set null,
  allow_sound boolean not null default true,
  enable_candle_blow boolean not null default true,
  confetti_intensity text not null default 'normal' check (confetti_intensity in ('subtle', 'normal', 'maximum')),
  custom_palette jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.surprise_settings enable row level security;

-- ------------------------------------------------------------------------------
-- 14. SURPRISE ANALYTICS
-- Event tracking for view counts, unwrap interactions, and replay triggers.
-- ------------------------------------------------------------------------------
create table if not exists public.surprise_analytics (
  id uuid primary key default gen_random_uuid(),
  surprise_id uuid not null references public.surprises(id) on delete cascade,
  event_type text not null check (event_type in ('open', 'unwrap', 'candle_blow', 'photo_view', 'replay')),
  device_type text, -- 'mobile', 'tablet', 'desktop'
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_surprise_analytics_surprise_id on public.surprise_analytics(surprise_id);

alter table public.surprise_analytics enable row level security;

-- ------------------------------------------------------------------------------
-- 15. ADMIN USERS & AUDIT LOGS
-- Role-controlled administration and governance.
-- ------------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'template_manager' check (role in ('superadmin', 'template_manager', 'moderator')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_table text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

-- ------------------------------------------------------------------------------
-- 16. AUTOMATIC TRIGGERS & FUNCTIONS
-- Auto-create profile on auth.users signup, and timestamp updater.
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url, created_at, updated_at, last_activity_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null),
    now(),
    now(),
    now()
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop trigger if already exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Trigger for updating `updated_at` column
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_templates_updated_at before update on public.templates for each row execute function public.set_updated_at();
create trigger set_surprises_updated_at before update on public.surprises for each row execute function public.set_updated_at();
create trigger set_surprise_settings_updated_at before update on public.surprise_settings for each row execute function public.set_updated_at();

-- ------------------------------------------------------------------------------
-- 17. ROW LEVEL SECURITY (RLS) POLICIES & HELPER FUNCTIONS
-- Strict access control: creators manage their own content; public sees published.
-- ------------------------------------------------------------------------------

-- Helper functions with SECURITY DEFINER to break RLS recursion on admin_users
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid()
  );
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid() and role = 'superadmin'
  );
$$;

-- Profiles: Anyone authenticated or public can read basic profiles; user can update their own.
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Categories: Public read-only
create policy "Categories viewable by everyone"
  on public.categories for select
  using (true);

create policy "Admins can manage categories"
  on public.categories for all
  using (public.is_admin());

-- Templates & Template Versions: Public read-only for active templates
create policy "Active templates viewable by everyone"
  on public.templates for select
  using (is_active = true or public.is_admin());

create policy "Admins can manage templates"
  on public.templates for all
  using (public.is_admin());

create policy "Template versions viewable by everyone"
  on public.template_versions for select
  using (is_published = true or public.is_admin());

create policy "Admins can manage template versions"
  on public.template_versions for all
  using (public.is_admin());

-- Scenes & Scene Objects: Public read-only
create policy "Scenes viewable by everyone"
  on public.scenes for select
  using (true);

create policy "Admins can manage scenes"
  on public.scenes for all
  using (public.is_admin());

create policy "Scene objects viewable by everyone"
  on public.scene_objects for select
  using (true);

create policy "Scene triggers viewable by everyone"
  on public.scene_triggers for select
  using (true);

-- Assets & Themes & Music: Public read-only
create policy "Assets viewable by everyone"
  on public.assets for select
  using (true);

create policy "Themes viewable by everyone"
  on public.themes for select
  using (true);

create policy "Music tracks viewable by everyone"
  on public.music_tracks for select
  using (true);

-- Surprises:
-- 1. Creator has full access (SELECT, INSERT, UPDATE, DELETE) to their own surprises.
-- 2. Public can SELECT surprises that are 'published'.
create policy "Creators can view their own surprises"
  on public.surprises for select
  using (auth.uid() = user_id);

create policy "Public can view published surprises"
  on public.surprises for select
  using (status = 'published');

create policy "Creators can insert their own surprises"
  on public.surprises for insert
  with check (auth.uid() = user_id);

create policy "Creators can update their own surprises"
  on public.surprises for update
  using (auth.uid() = user_id);

create policy "Creators can delete their own surprises"
  on public.surprises for delete
  using (auth.uid() = user_id);

-- Surprise Photos:
-- Owner can CRUD photos; public can view if surprise is published.
create policy "Creators can manage photos of their surprises"
  on public.surprise_photos for all
  using (
    exists (
      select 1 from public.surprises
      where surprises.id = surprise_photos.surprise_id
      and surprises.user_id = auth.uid()
    )
  );

create policy "Public can view photos of published surprises"
  on public.surprise_photos for select
  using (
    exists (
      select 1 from public.surprises
      where surprises.id = surprise_photos.surprise_id
      and surprises.status = 'published'
    )
  );

-- Surprise Settings:
create policy "Creators can manage settings of their surprises"
  on public.surprise_settings for all
  using (
    exists (
      select 1 from public.surprises
      where surprises.id = surprise_settings.surprise_id
      and surprises.user_id = auth.uid()
    )
  );

create policy "Public can view settings of published surprises"
  on public.surprise_settings for select
  using (
    exists (
      select 1 from public.surprises
      where surprises.id = surprise_settings.surprise_id
      and surprises.status = 'published'
    )
  );

-- Surprise Analytics: Public insert for events (e.g. view, unwrap); creator read
create policy "Anyone can record surprise analytics"
  on public.surprise_analytics for insert
  with check (true);

create policy "Creators can view their surprise analytics"
  on public.surprise_analytics for select
  using (
    exists (
      select 1 from public.surprises
      where surprises.id = surprise_analytics.surprise_id
      and surprises.user_id = auth.uid()
    )
  );

-- Admin Users & Audit Logs:
create policy "Superadmins can manage admin users"
  on public.admin_users for all
  using (public.is_superadmin());

create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (public.is_admin());

-- ------------------------------------------------------------------------------
-- 18. SUPABASE STORAGE BUCKETS & POLICIES
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('user-photos', 'user-photos', false),
  ('template-previews', 'template-previews', true),
  ('3d-assets', '3d-assets', true),
  ('music', 'music', true),
  ('theme-assets', 'theme-assets', true),
  ('generated-previews', 'generated-previews', true)
on conflict (id) do nothing;

-- Storage Policy: user-photos (Users upload to their folder; public view if published)
create policy "Users can upload their own photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'user-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can read and manage their own photos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'user-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Public assets (template-previews, 3d-assets, music, theme-assets)
create policy "Public assets are readable by anyone"
  on storage.objects for select
  using (bucket_id in ('template-previews', '3d-assets', 'music', 'theme-assets', 'generated-previews'));

create policy "Admins can manage public assets"
  on storage.objects for all
  to authenticated
  using (
    bucket_id in ('template-previews', '3d-assets', 'music', 'theme-assets')
    and public.is_admin()
  );

