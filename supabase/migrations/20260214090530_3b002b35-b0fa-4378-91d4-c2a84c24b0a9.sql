
-- Fix the security definer view issue
DROP VIEW IF EXISTS public.public_reviews;

CREATE VIEW public.public_reviews
WITH (security_invoker = true)
AS
SELECT id, business_card_id, value, description, created_at
FROM public.reviews;

GRANT SELECT ON public.public_reviews TO anon, authenticated;
