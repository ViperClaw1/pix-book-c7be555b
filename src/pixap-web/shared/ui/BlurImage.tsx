import { useState, ImgHTMLAttributes } from "react";
import { cn } from "../lib/cn";

/**
 * Convert a Supabase Storage public URL into a tiny, transformed preview
 * URL via the render/image endpoint. Returns null for non-Supabase URLs
 * (component will just show the shimmer placeholder instead).
 */
function getSupabaseThumbUrl(src: string): string | null {
  if (!src) return null;
  const marker = "/storage/v1/object/public/";
  const idx = src.indexOf(marker);
  if (idx === -1) return null;
  const base = src.slice(0, idx);
  const path = src.slice(idx + marker.length).split("?")[0];
  return `${base}/storage/v1/render/image/public/${path}?width=24&quality=20&resize=cover`;
}

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Optional CSS classes for the wrapper. */
  wrapperClassName?: string;
}

/**
 * Image with a shimmer placeholder + Supabase blur-up preview that fades
 * to the full image once it loads. Drop-in replacement for plain `<img>`
 * inside an absolutely-positioned container (the wrapper is `absolute inset-0`).
 */
export function BlurImage({
  src,
  alt,
  className,
  wrapperClassName,
  onLoad,
  ...rest
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const thumb = getSupabaseThumbUrl(src);

  return (
    <span
      className={cn(
        "absolute inset-0 block overflow-hidden",
        !loaded && "pixap-shimmer",
        wrapperClassName,
      )}
      aria-hidden={false}
    >
      {thumb ? (
        <img
          src={thumb}
          alt=""
          aria-hidden
          draggable={false}
          className={cn(
            "pixap-blur-preview transition-opacity duration-300",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}
      <img
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        {...rest}
      />
    </span>
  );
}
