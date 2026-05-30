
-- 1. Lock down SECURITY DEFINER helper functions: revoke EXECUTE from anon/authenticated.
--    They are called by triggers and inside RLS policies (which run as owner) - direct API access not needed.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_category_count() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.prevent_role_self_assignment() FROM anon, authenticated, public;

-- 2. Storage bucket listing: drop broad SELECT policy on business-cards.
--    The bucket stays public for direct file URLs (public buckets bypass RLS for /object/public/), but
--    clients can no longer LIST all objects in the bucket.
DROP POLICY IF EXISTS "Public can view business card images" ON storage.objects;

-- 3. Reviews are intentionally public (shown on public /place/:id pages).
--    Replace authenticated-only SELECT with anon+authenticated read access; this is documented as intentional.
DROP POLICY IF EXISTS "Authenticated users can read reviews" ON public.reviews;
CREATE POLICY "Reviews are publicly readable"
ON public.reviews
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.reviews TO anon;
