
-- Fix: Restrict direct SELECT on reviews table to only the review author
-- This prevents public exposure of user_id through direct table access
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;

CREATE POLICY "Users can read own reviews"
ON public.reviews
FOR SELECT
USING (user_id = auth.uid());

-- Recreate public_reviews view as security definer (default) so it can
-- still read from the now-restricted reviews table for public access
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews AS
SELECT id, business_card_id, value, description, created_at
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon, authenticated;
