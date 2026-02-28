

## Replace Image URL Input with Image Uploader

### Overview

Replace the plain "Image URL" text input in the Add/Edit Business Card dialog with a visual drag-and-drop image uploader. The uploader will be 200px tall, display an upload icon and placeholder text, and store images in a storage bucket.

### 1. Create Storage Bucket (Database Migration)

Create a `business-cards` storage bucket for uploaded images:

```sql
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
```

### 2. Create `ImageUploader` Component

New file: `src/components/admin/ImageUploader.tsx`

A reusable component that:
- Renders a 200px-tall dashed-border drop zone
- Shows an `Upload` (or `ImagePlus`) icon from lucide-react centered inside
- Displays placeholder text like "Click or drag to upload an image" beneath the icon
- Accepts click to open file picker and drag-and-drop
- On file select: uploads to the `business-cards` bucket via Supabase Storage, then calls `onUpload(publicUrl)` to set the form value
- Shows a loading spinner during upload
- When a value (URL) is already set, displays the image as a preview with a remove/replace button

### 3. Update `AdminBusinessCards.tsx`

- Import `ImageUploader`
- Replace line 194 (`<Input placeholder="Image URL" .../>`) with:
  ```tsx
  <ImageUploader
    value={form.image}
    onUpload={(url) => setField("image", url)}
    onRemove={() => setField("image", "")}
  />
  ```
- No other logic changes needed -- the form's `image` field will still hold a URL string, now pointing to the storage bucket

### Technical Notes

- The uploader generates a unique filename using `crypto.randomUUID()` to avoid collisions
- Accepted file types: `image/*` (jpg, png, webp, etc.)
- The public URL is constructed via `supabase.storage.from('business-cards').getPublicUrl(path)`
- When editing an existing card that already has an image URL, the uploader shows the preview immediately
