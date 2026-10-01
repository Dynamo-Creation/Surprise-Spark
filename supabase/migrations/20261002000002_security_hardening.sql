-- ==============================================================================
-- SURPRISESPARK: COMPREHENSIVE SECURITY AUDIT & RLS HARDENING MIGRATION
-- Migration: 20261002000002_security_hardening.sql
-- Applied to: unpumpwsxyjvfqwtslss (Production Supabase)
-- ==============================================================================

-- 1. HARDEN SECURITY DEFINER FUNCTIONS & SEARCH PATHS
-- Protect against search_path hijacking vulnerabilities (Supabase lint 0011)

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$;

-- Revoke handle_new_user from public/anon/authenticated to prevent external HTTP RPC execution
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Hardened admin check functions with search_path set to public, auth
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND email IN ('sonu25580@gmail.com', 'admin@surprisespark.app', 'admin@partnerincrime.app')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'superadmin'
  ) OR EXISTS (
    SELECT 1 FROM auth.users WHERE id = auth.uid() AND email IN ('sonu25580@gmail.com', 'admin@surprisespark.app')
  );
$$;

-- Revoke is_admin/is_superadmin from PUBLIC and anon (only authenticated and service_role can call)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

REVOKE ALL ON FUNCTION public.is_superadmin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_superadmin() TO authenticated;

-- 2. COMPLETE ROW LEVEL SECURITY POLICIES FOR ADMIN WRITE ACCESS
-- Ensure every table with public SELECT has proper administrative write policies

CREATE POLICY "Admins can manage assets" ON public.assets
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage music tracks" ON public.music_tracks
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage themes" ON public.themes
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage scene objects" ON public.scene_objects
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage scene triggers" ON public.scene_triggers
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage profiles" ON public.profiles
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage asset slots" ON public.asset_slots
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage asset versions" ON public.asset_versions
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins can manage template asset assignments" ON public.template_asset_assignments
FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. RLS INITPLAN OPTIMIZATIONS (Eliminating per-row auth.uid() evaluation)
-- Uses (select auth.uid()) to turn volatile function calls into single subquery initPlans

ALTER POLICY "Users can update their own profile" ON public.profiles
USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

ALTER POLICY "Creators can view their own surprises" ON public.surprises
USING ((select auth.uid()) = user_id);

ALTER POLICY "Creators can insert their own surprises" ON public.surprises
WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Creators can update their own surprises" ON public.surprises
USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

ALTER POLICY "Creators can delete their own surprises" ON public.surprises
USING ((select auth.uid()) = user_id);

ALTER POLICY "Creators can manage photos of their surprises" ON public.surprise_photos
USING (EXISTS (SELECT 1 FROM public.surprises WHERE surprises.id = surprise_photos.surprise_id AND surprises.user_id = (select auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.surprises WHERE surprises.id = surprise_photos.surprise_id AND surprises.user_id = (select auth.uid())));

ALTER POLICY "Creators can manage settings of their surprises" ON public.surprise_settings
USING (EXISTS (SELECT 1 FROM public.surprises WHERE surprises.id = surprise_settings.surprise_id AND surprises.user_id = (select auth.uid())))
WITH CHECK (EXISTS (SELECT 1 FROM public.surprises WHERE surprises.id = surprise_settings.surprise_id AND surprises.user_id = (select auth.uid())));

ALTER POLICY "Creators can view their surprise analytics" ON public.surprise_analytics
USING (EXISTS (SELECT 1 FROM public.surprises WHERE surprises.id = surprise_analytics.surprise_id AND surprises.user_id = (select auth.uid())));

ALTER POLICY "Users can publish surprises" ON public.published_surprises
WITH CHECK (((select auth.uid()) = user_id) OR (user_id IS NULL));

ALTER POLICY "Allow public insert for published_surprises" ON public.published_surprises
WITH CHECK (((select auth.uid()) = user_id) OR (user_id IS NULL));

ALTER POLICY "Creators can update their own published surprises" ON public.published_surprises
USING (((select auth.uid()) = user_id) OR public.is_admin())
WITH CHECK (((select auth.uid()) = user_id) OR public.is_admin());

ALTER POLICY "Allow public update for published_surprises" ON public.published_surprises
USING (((select auth.uid()) = user_id) OR public.is_admin())
WITH CHECK (((select auth.uid()) = user_id) OR public.is_admin());

ALTER POLICY "Creators can delete their own published surprises" ON public.published_surprises
USING (((select auth.uid()) = user_id) OR public.is_admin());

-- 4. STORAGE HARDENING
-- Restrict direct uploads to the music bucket from anonymous visitors to authenticated users only
ALTER POLICY "Public audio upload to music bucket" ON storage.objects
TO authenticated WITH CHECK (bucket_id = 'music'::text);

-- 5. FOREIGN KEY COVERING INDEXES
-- Covering B-Tree indexes for relational integrity and join performance
CREATE INDEX IF NOT EXISTS idx_asset_slots_default_asset_id ON public.asset_slots(default_asset_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_music_tracks_category_id ON public.music_tracks(category_id);
CREATE INDEX IF NOT EXISTS idx_scene_objects_asset_id ON public.scene_objects(asset_id);
CREATE INDEX IF NOT EXISTS idx_scene_objects_scene_id ON public.scene_objects(scene_id);
CREATE INDEX IF NOT EXISTS idx_scene_triggers_scene_id ON public.scene_triggers(scene_id);
CREATE INDEX IF NOT EXISTS idx_scenes_template_id ON public.scenes(template_id);
CREATE INDEX IF NOT EXISTS idx_surprise_settings_music_track_id ON public.surprise_settings(music_track_id);
CREATE INDEX IF NOT EXISTS idx_surprise_settings_theme_id ON public.surprise_settings(theme_id);
CREATE INDEX IF NOT EXISTS idx_surprises_category_id ON public.surprises(category_id);
CREATE INDEX IF NOT EXISTS idx_surprises_template_id ON public.surprises(template_id);
CREATE INDEX IF NOT EXISTS idx_template_asset_assignments_asset_id ON public.template_asset_assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_template_asset_assignments_slot_id ON public.template_asset_assignments(slot_id);
CREATE INDEX IF NOT EXISTS idx_templates_category_id ON public.templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_default_music_id ON public.templates(default_music_id);
CREATE INDEX IF NOT EXISTS idx_templates_default_theme_id ON public.templates(default_theme_id);
