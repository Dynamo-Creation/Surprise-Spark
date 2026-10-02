-- ==============================================================================
-- SURPRISESPARK: USER FEEDBACK & BUG REPORTING TABLE
-- Safe, isolated storage for creator and user feedback with strict RLS.
-- ==============================================================================

-- 1. Create user_feedbacks table
CREATE TABLE IF NOT EXISTS public.user_feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text NOT NULL DEFAULT '',
  user_email text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('bug', 'suggestion', 'general')),
  rating text CHECK (rating IN ('broken', 'confused', 'neutral', 'good', 'loved')),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes for fast admin queries
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_user_id ON public.user_feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_status ON public.user_feedbacks(status);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_category ON public.user_feedbacks(category);
CREATE INDEX IF NOT EXISTS idx_user_feedbacks_created_at ON public.user_feedbacks(created_at DESC);

-- 3. Trigger for updated_at
DROP TRIGGER IF EXISTS set_user_feedbacks_updated_at ON public.user_feedbacks;
CREATE TRIGGER set_user_feedbacks_updated_at
  BEFORE UPDATE ON public.user_feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- 4. Enable Row Level Security
ALTER TABLE public.user_feedbacks ENABLE ROW LEVEL SECURITY;

-- 5. Granular Security Policies
-- Policy: Authenticated users can insert their own feedback
DROP POLICY IF EXISTS "Users can submit feedback" ON public.user_feedbacks;
CREATE POLICY "Users can submit feedback" ON public.user_feedbacks
  FOR INSERT WITH CHECK (
    ((select auth.uid()) = user_id) OR (user_id IS NULL)
  );

-- Policy: Only verified admins can view all feedback
DROP POLICY IF EXISTS "Only admins can view feedback" ON public.user_feedbacks;
CREATE POLICY "Only admins can view feedback" ON public.user_feedbacks
  FOR SELECT USING (public.is_admin());

-- Policy: Only verified admins can update feedback (status, admin notes)
DROP POLICY IF EXISTS "Only admins can update feedback" ON public.user_feedbacks;
CREATE POLICY "Only admins can update feedback" ON public.user_feedbacks
  FOR UPDATE USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Policy: Only verified admins can delete feedback
DROP POLICY IF EXISTS "Only admins can delete feedback" ON public.user_feedbacks;
CREATE POLICY "Only admins can delete feedback" ON public.user_feedbacks
  FOR DELETE USING (public.is_admin());
