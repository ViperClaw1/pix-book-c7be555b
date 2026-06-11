import { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface ChoiceChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  size?: "md" | "lg";
}

export function ChoiceChip({
  selected,
  size = "md",
  className,
  children,
  ...rest
}: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--pixap-radius-pill)]",
        "border transition-colors active:scale-[0.98] font-medium",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixap-accent)]",
        size === "md" ? "h-10 px-4 text-[13px]" : "h-12 px-5 text-[14px]",
        selected
          ? "bg-[var(--pixap-accent)] text-[var(--pixap-on-accent)] border-[var(--pixap-accent)]"
          : "bg-[var(--pixap-surface)] text-[var(--pixap-text)] border-[var(--pixap-border)] hover:bg-[var(--pixap-tag-muted)]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
