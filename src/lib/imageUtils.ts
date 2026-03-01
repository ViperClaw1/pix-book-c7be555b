/**
 * Returns an optimized image URL with width/height params where supported.
 * - Supabase storage: uses image transformation API
 * - Unsplash: uses w/h query params
 * - Other URLs: returned as-is
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number,
  height?: number
): string {
  if (!url) return "";

  // Supabase storage transformation
  if (url.includes("supabase.co/storage/v1/object/public/")) {
    const params = new URLSearchParams();
    params.set("width", String(width));
    if (height) params.set("height", String(height));
    params.set("quality", "75");
    // Transform URL: /object/public/ -> /render/image/public/
    const transformed = url.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    return `${transformed}?${params.toString()}`;
  }

  // Unsplash: replace w= param
  if (url.includes("images.unsplash.com")) {
    try {
      const u = new URL(url);
      u.searchParams.set("w", String(width));
      if (height) u.searchParams.set("h", String(height));
      u.searchParams.set("q", "75");
      u.searchParams.set("auto", "format");
      return u.toString();
    } catch {
      return url;
    }
  }

  return url;
}
