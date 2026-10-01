-- ==============================================================================
-- SURPRISESPARK: ADMIN REAL DATA TELEMETRY & USER OVERVIEW RPC FUNCTIONS
-- Provides secure, zero-credential operational insight for authorized administrators.
-- Passwords, auth tokens, salts, and secret credentials are NEVER exposed.
-- ==============================================================================

-- 1. Secure RPC function to retrieve aggregated user overview for Admin Console
CREATE OR REPLACE FUNCTION public.get_admin_users_overview()
RETURNS TABLE (
  id uuid,
  email text,
  display_name text,
  role text,
  created_at timestamptz,
  last_activity_at timestamptz,
  surprises_count int,
  published_count int,
  template_usage text[],
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Strict authentication guard: caller must have a valid session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  -- Strict authorization guard: must be in admin_users or match authorized admin email
  IF NOT (
    public.is_admin() OR 
    EXISTS (
      SELECT 1 FROM auth.users u 
      WHERE u.id = auth.uid() 
      AND u.email IN ('sonu25580@gmail.com', 'admin@surprisespark.app', 'admin@partnerincrime.app')
    )
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::text,
    COALESCE(p.display_name, split_part(u.email::text, '@', 1))::text as display_name,
    COALESCE(a.role, CASE WHEN COUNT(s.public_id) > 0 THEN 'creator' ELSE 'user' END)::text as role,
    u.created_at,
    u.last_sign_in_at as last_activity_at,
    COUNT(s.public_id)::int as surprises_count,
    COUNT(s.public_id)::int as published_count,
    COALESCE(array_agg(DISTINCT s.template_slug) FILTER (WHERE s.template_slug IS NOT NULL), '{}')::text[] as template_usage,
    'active'::text as status
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.admin_users a ON u.id = a.id
  LEFT JOIN public.published_surprises s ON u.id = s.user_id
  GROUP BY u.id, u.email, p.display_name, a.role, u.created_at, u.last_sign_in_at
  ORDER BY u.created_at DESC;
END;
$$;

-- 2. Secure RPC function to retrieve live platform metrics for Admin Dashboard
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_total_users int;
  v_new_users_today int;
  v_total_surprises int;
  v_surprises_today int;
  v_popular_templates jsonb;
  v_recent_activity jsonb;
BEGIN
  -- Strict authentication guard: caller must have a valid session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Access denied. Authentication required.';
  END IF;

  -- Strict authorization guard
  IF NOT (
    public.is_admin() OR 
    EXISTS (
      SELECT 1 FROM auth.users u 
      WHERE u.id = auth.uid() 
      AND u.email IN ('sonu25580@gmail.com', 'admin@surprisespark.app', 'admin@partnerincrime.app')
    )
  ) THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.';
  END IF;

  SELECT count(*)::int INTO v_total_users FROM auth.users;
  SELECT count(*)::int INTO v_new_users_today FROM auth.users WHERE created_at >= CURRENT_DATE;
  SELECT count(*)::int INTO v_total_surprises FROM public.published_surprises;
  SELECT count(*)::int INTO v_surprises_today FROM public.published_surprises WHERE created_at >= CURRENT_DATE;

  SELECT jsonb_agg(sub) INTO v_popular_templates FROM (
    SELECT 
      template_slug as slug,
      initcap(replace(template_slug, '-', ' ')) as name,
      count(*)::int as count
    FROM public.published_surprises
    GROUP BY template_slug
    ORDER BY count(*) DESC
    LIMIT 6
  ) sub;

  SELECT jsonb_agg(act) INTO v_recent_activity FROM (
    SELECT 
      s.public_id,
      s.template_slug,
      s.recipient_name,
      s.sender_name,
      s.created_at,
      COALESCE(u.email, 'Guest / Creator') as creator_email
    FROM public.published_surprises s
    LEFT JOIN auth.users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
    LIMIT 10
  ) act;

  RETURN jsonb_build_object(
    'totalUsers', COALESCE(v_total_users, 0),
    'newUsersToday', COALESCE(v_new_users_today, 0),
    'activeUsers', COALESCE(v_total_users, 0),
    'totalSurprises', COALESCE(v_total_surprises, 0),
    'surprisesCreatedToday', COALESCE(v_surprises_today, 0),
    'popularTemplates', COALESCE(v_popular_templates, '[]'::jsonb),
    'recentActivity', COALESCE(v_recent_activity, '[]'::jsonb)
  );
END;
$$;

-- 3. Revoke public/anon access and grant only to authenticated role
REVOKE EXECUTE ON FUNCTION public.get_admin_users_overview() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users_overview() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_admin_dashboard_metrics() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_metrics() TO authenticated;
