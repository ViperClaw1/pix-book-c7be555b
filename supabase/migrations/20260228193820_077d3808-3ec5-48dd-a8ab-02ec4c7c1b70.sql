
CREATE POLICY "Admins can insert shopping items"
ON public.shopping_items FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update shopping items"
ON public.shopping_items FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete shopping items"
ON public.shopping_items FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
