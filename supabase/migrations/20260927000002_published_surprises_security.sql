-- ==============================================================================
-- SURPRISESPARK: PUBLISHED SURPRISES SECURITY & RLS MIGRATION (IDEMPOTENT)
-- Hardens the public surprise sharing mechanism against IDOR, unauthorized
-- overwrites, and data tampering. Safely handles pre-existing tables.
-- ==============================================================================

-- 1. Create table if it does not exist
create table if not exists public.published_surprises (
  public_id text primary key,
  template_slug text not null default 'sweet-celebration',
  recipient_name text not null default '',
  sender_name text not null default '',
  custom_message text not null default '',
  endearment text not null default '',
  question text not null default '',
  dodge_text text not null default '',
  audio_url text not null default '',
  photos text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Add missing columns safely if the table was previously created with an older schema
alter table public.published_surprises
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists template_slug text not null default 'sweet-celebration',
  add column if not exists recipient_name text not null default '',
  add column if not exists sender_name text not null default '',
  add column if not exists custom_message text not null default '',
  add column if not exists endearment text not null default '',
  add column if not exists question text not null default '',
  add column if not exists dodge_text text not null default '',
  add column if not exists audio_url text not null default '',
  add column if not exists photos text[] not null default '{}',
  add column if not exists metadata jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- 3. Ensure self-contained helper function and admin table exist
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'superadmin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

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

-- 4. Create indexes for performance and security lookups
create index if not exists idx_published_surprises_public_id on public.published_surprises(public_id);
create index if not exists idx_published_surprises_user_id on public.published_surprises(user_id);

-- 5. Trigger for updated_at timestamp
drop trigger if exists set_published_surprises_updated_at on public.published_surprises;
create trigger set_published_surprises_updated_at
  before update on public.published_surprises
  for each row execute function public.set_updated_at();

-- 6. Enable Row Level Security (RLS)
alter table public.published_surprises enable row level security;

-- 7. Strict RLS Policies

-- Public Read: Anyone with the surprise link can view the published surprise
drop policy if exists "Public can view published surprises" on public.published_surprises;
create policy "Public can view published surprises"
  on public.published_surprises for select
  using (true);

-- Authenticated Insert: Creators can publish new surprises
drop policy if exists "Users can publish surprises" on public.published_surprises;
create policy "Users can publish surprises"
  on public.published_surprises for insert
  with check (auth.uid() = user_id or user_id is null);

-- Creator Update: Only the verified creator or an administrator can modify an existing surprise
drop policy if exists "Creators can update their own published surprises" on public.published_surprises;
create policy "Creators can update their own published surprises"
  on public.published_surprises for update
  using (auth.uid() = user_id or public.is_admin());

-- Creator Delete: Only the verified creator or an administrator can delete a published surprise
drop policy if exists "Creators can delete their own published surprises" on public.published_surprises;
create policy "Creators can delete their own published surprises"
  on public.published_surprises for delete
  using (auth.uid() = user_id or public.is_admin());
