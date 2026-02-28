INSERT INTO storage.buckets (id, name, public) VALUES ('business-cards', 'business-cards', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload business card images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business-cards');

-- Allow public read access
CREATE POLICY "Public can view business card images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'business-cards');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete business card images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'business-cards');