import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-3 text-[13px]",
  md: "h-11 px-4 text-[14px]",
  lg: "h-12 px-5 text-[15px]",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-[var(--pixap-primary)] text-[var(--pixap-background)] hover:opacity-90",
  secondary:
    "bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)] hover:opacity-90",
  ghost:
    "bg-transparent text-[var(--pixap-text)] hover:bg-[var(--pixap-tag-muted)]",
  accent:
    "bg-[var(--pixap-accent)] text-[var(--pixap-on-accent)] hover:opacity-90",
};

export const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  function AppButton(
    {
      variant = "primary",
      size = "md",
      loading,
      fullWidth,
      className,
      disabled,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold rounded-[var(--pixap-radius-button)]",
          "transition-opacity active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixap-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pixap-background)]",
          sizeMap[size],
          variantMap[variant],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span
            aria-hidden
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
