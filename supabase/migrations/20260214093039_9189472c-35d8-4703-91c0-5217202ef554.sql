
-- Fix: Change public_reviews from security definer to security invoker
-- to satisfy the Supabase linter requirement

-- Restore public SELECT on base reviews table so the invoker view can read
DROP POLICY IF EXISTS "Users can read own reviews" ON public.reviews;

CREATE POLICY "Anyone can read reviews"
ON public.reviews
FOR SELECT
USING (true);

-- Recreate view with security_invoker = true
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews
WITH (security_invoker = true)
AS
SELECT id, business_card_id, value, description, created_at
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon, authenticated;
