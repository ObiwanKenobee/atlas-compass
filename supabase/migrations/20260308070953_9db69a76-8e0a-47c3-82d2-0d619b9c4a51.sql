
-- ============================================================
-- 1. DROP existing overly-permissive UPDATE/INSERT policies
-- ============================================================

-- financial_metrics
DROP POLICY IF EXISTS "Financial metrics are editable" ON public.financial_metrics;
CREATE POLICY "Authenticated users can update financial metrics"
  ON public.financial_metrics FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- cost_structure
DROP POLICY IF EXISTS "Cost structure is editable" ON public.cost_structure;
CREATE POLICY "Authenticated users can update cost structure"
  ON public.cost_structure FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- revenue_streams
DROP POLICY IF EXISTS "Revenue streams are editable" ON public.revenue_streams;
CREATE POLICY "Authenticated users can update revenue streams"
  ON public.revenue_streams FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- metrics_history
DROP POLICY IF EXISTS "Metrics history is editable" ON public.metrics_history;
DROP POLICY IF EXISTS "Metrics history is insertable" ON public.metrics_history;
CREATE POLICY "Authenticated users can update metrics history"
  ON public.metrics_history FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert metrics history"
  ON public.metrics_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- investor_updates
DROP POLICY IF EXISTS "Investor updates are editable" ON public.investor_updates;
DROP POLICY IF EXISTS "Investor updates are insertable" ON public.investor_updates;
CREATE POLICY "Authenticated users can update investor updates"
  ON public.investor_updates FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert investor updates"
  ON public.investor_updates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- 2. Investor profiles table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.investor_profiles (
  id          uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL UNIQUE,
  firm_name   text,
  full_name   text,
  access_tier text NOT NULL DEFAULT 'observer' CHECK (access_tier IN ('observer', 'full')),
  notes       text,
  created_at  timestamp with time zone NOT NULL DEFAULT now(),
  updated_at  timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can view their own profile"
  ON public.investor_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Investors can update their own profile"
  ON public.investor_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Investors can insert their own profile"
  ON public.investor_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on new user sign-in
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.investor_profiles (user_id, full_name, firm_name, access_tier)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NULL,
    'observer'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_investor_profiles_updated_at
  BEFORE UPDATE ON public.investor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
