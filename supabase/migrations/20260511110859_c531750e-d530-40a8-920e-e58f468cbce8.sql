
-- 1. Shopping cart: scope policies to authenticated role
DROP POLICY IF EXISTS "Users read own shopping cart" ON public.shopping_cart_items;
DROP POLICY IF EXISTS "Users insert own shopping cart" ON public.shopping_cart_items;
DROP POLICY IF EXISTS "Users update own shopping cart" ON public.shopping_cart_items;
DROP POLICY IF EXISTS "Users delete own shopping cart" ON public.shopping_cart_items;

CREATE POLICY "Users read own shopping cart"
  ON public.shopping_cart_items FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own shopping cart"
  ON public.shopping_cart_items FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own shopping cart"
  ON public.shopping_cart_items FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own shopping cart"
  ON public.shopping_cart_items FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 2. Storage: admin-only UPDATE policy on business-cards bucket
DROP POLICY IF EXISTS "Admins can update business-cards files" ON storage.objects;
CREATE POLICY "Admins can update business-cards files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'business-cards' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'business-cards' AND public.has_role(auth.uid(), 'admin'));

-- 3. Realtime: restrict notifications topic subscriptions to the owning user
-- Topic format used by client: "notifications-realtime" with postgres_changes filter user_id=eq.<uid>
-- We add RLS on realtime.messages so users can only subscribe to topics named "notifications:<their-uid>"
-- and we update client to use a per-user topic.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users subscribe to own notification topic" ON realtime.messages;
CREATE POLICY "Users subscribe to own notification topic"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (
    realtime.topic() = 'notifications:' || auth.uid()::text
    OR realtime.topic() NOT LIKE 'notifications:%'
  );
