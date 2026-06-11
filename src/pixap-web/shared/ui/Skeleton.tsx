import { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--pixap-radius-card-sm)] bg-[var(--pixap-tag-muted)]",
        className,
      )}
      {...rest}
    />
  );
}
