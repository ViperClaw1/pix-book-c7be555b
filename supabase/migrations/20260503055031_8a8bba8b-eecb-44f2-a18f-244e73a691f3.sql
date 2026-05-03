-- 1. Restrict storage business-cards INSERT/DELETE to admins only
DROP POLICY IF EXISTS "Authenticated users can upload business card images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete business card images" ON storage.objects;

CREATE POLICY "Admins can upload business card images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business-cards' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete business card images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'business-cards' AND public.has_role(auth.uid(), 'admin'));

-- 2. Restrict reviews SELECT to authenticated users (hides user_id from anonymous enumeration)
DROP POLICY IF EXISTS "Anyone can read reviews" ON public.reviews;
CREATE POLICY "Authenticated users can read reviews"
ON public.reviews FOR SELECT TO authenticated
USING (true);

-- 3. Harden user_roles against privilege escalation with a trigger
-- Even if RLS were bypassed, this trigger blocks any non-admin from inserting/updating roles
CREATE OR REPLACE FUNCTION public.prevent_role_self_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow if current request is from service_role (no auth.uid())
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  -- Otherwise, only existing admins can assign roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can assign user roles';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_role_assignment ON public.user_roles;
CREATE TRIGGER enforce_role_assignment
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_self_assignment();