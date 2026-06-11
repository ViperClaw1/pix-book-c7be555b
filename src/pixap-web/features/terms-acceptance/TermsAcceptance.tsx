import { Link } from "react-router-dom";
import { cn } from "@/pixap-web/shared/lib/cn";

export interface TermsAcceptanceProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  error?: string;
  className?: string;
}

export function TermsAcceptance({
  checked,
  onChange,
  error,
  className,
}: TermsAcceptanceProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="flex items-start gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-[3px] h-4 w-4 accent-[var(--pixap-accent)]"
          aria-invalid={!!error}
        />
        <span className="text-[13px] leading-[18px] text-[var(--pixap-text-muted)]">
          I agree to the{" "}
          <Link
            to="/terms"
            target="_blank"
            className="text-[var(--pixap-link)] underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            target="_blank"
            className="text-[var(--pixap-link)] underline"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error ? (
        <span className="text-[12px] text-[var(--pixap-danger)] pl-6">{error}</span>
      ) : null}
    </div>
  );
}
