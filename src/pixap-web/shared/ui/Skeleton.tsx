import { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pixap-shimmer rounded-[var(--pixap-radius-card-sm)]",
        className,
      )}
      {...rest}
    />
  );
}
