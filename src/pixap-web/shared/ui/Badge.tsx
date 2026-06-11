import { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

type Tone = "neutral" | "accent" | "success" | "danger";

const toneMap: Record<Tone, string> = {
  neutral:
    "bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)]",
  accent:
    "bg-[var(--pixap-accent)] text-[var(--pixap-on-accent)]",
  success:
    "bg-[var(--pixap-success-surface)] text-[var(--pixap-text)]",
  danger:
    "bg-[var(--pixap-danger-surface)] text-[var(--pixap-danger)]",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 h-5 rounded-full text-[11px] font-semibold leading-none",
        toneMap[tone],
        className,
      )}
      {...rest}
    />
  );
}
