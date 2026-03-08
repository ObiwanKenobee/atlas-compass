
-- Security definer function to check if current user has full access tier
-- Uses SECURITY DEFINER to avoid RLS recursion on investor_profiles
CREATE OR REPLACE FUNCTION public.is_full_access_investor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.investor_profiles
    WHERE user_id = auth.uid()
      AND access_tier = 'full'
  )
$$;

-- Allow full-access investors to view ALL profiles (for admin panel)
CREATE POLICY "Full access investors can view all profiles"
ON public.investor_profiles
FOR SELECT
USING (public.is_full_access_investor());

-- Allow full-access investors to update any profile's access_tier and notes
CREATE POLICY "Full access investors can update any profile"
ON public.investor_profiles
FOR UPDATE
USING (public.is_full_access_investor())
WITH CHECK (public.is_full_access_investor());
