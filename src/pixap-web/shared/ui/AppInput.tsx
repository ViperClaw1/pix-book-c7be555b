import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "../lib/cn";

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(
  function AppInput({ label, error, hint, id, className, ...rest }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[var(--pixap-text)]"
          >
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={!!error}
          className={cn(
            "h-11 w-full rounded-[var(--pixap-radius-button)] px-3 text-[14px]",
            "bg-[var(--pixap-surface)] text-[var(--pixap-text)]",
            "border border-[var(--pixap-border)] placeholder:text-[var(--pixap-text-muted)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--pixap-accent)]",
            error && "border-[var(--pixap-danger)] focus:ring-[var(--pixap-danger)]",
            className,
          )}
          {...rest}
        />
        {error ? (
          <span className="text-[12px] text-[var(--pixap-danger)]">{error}</span>
        ) : hint ? (
          <span className="text-[12px] text-[var(--pixap-text-muted)]">{hint}</span>
        ) : null}
      </div>
    );
  },
);
