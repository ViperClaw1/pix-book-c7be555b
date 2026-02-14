
-- Create a public view that excludes user_id from reviews
CREATE OR REPLACE VIEW public.public_reviews AS
SELECT id, business_card_id, value, description, created_at
FROM public.reviews;

-- Grant access to the view
GRANT SELECT ON public.public_reviews TO anon, authenticated;
