import { useState } from "react";
import { cn } from "../lib/cn";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: number;
  className?: string;
}

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, alt, name, size = 40, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden rounded-full",
        "bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)] font-semibold",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-label={alt ?? name ?? "avatar"}
    >
      {showImg ? (
        <img
          src={src!}
          alt={alt ?? name ?? ""}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
