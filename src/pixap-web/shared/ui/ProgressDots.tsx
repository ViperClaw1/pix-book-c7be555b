import { cn } from "../lib/cn";

export function ProgressDots({
  total,
  current,
  className,
}: {
  total: number;
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all",
            i === current
              ? "w-6 bg-[var(--pixap-accent)]"
              : i < current
                ? "w-1.5 bg-[var(--pixap-accent)]/60"
                : "w-1.5 bg-[var(--pixap-border)]",
          )}
        />
      ))}
    </div>
  );
}
