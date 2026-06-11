import {
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/pixap-web/shared/lib/cn";

export interface OtpInputProps {
  value: string;
  onChange: (next: string) => void;
  length?: number;
  disabled?: boolean;
  error?: string;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled,
  error,
  autoFocus = true,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = useMemo(() => {
    const arr = value.split("").slice(0, length);
    while (arr.length < length) arr.push("");
    return arr;
  }, [value, length]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);

  const setAt = (idx: number, char: string) => {
    const clean = char.replace(/\D/g, "").slice(0, 1);
    const next = digits.slice();
    next[idx] = clean;
    onChange(next.join(""));
    if (clean && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text.padEnd(length, "").slice(0, length).replace(/\s/g, ""));
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2 justify-between" onPaste={onPaste}>
        {digits.map((d, idx) => (
          <input
            key={idx}
            ref={(el) => (refs.current[idx] = el)}
            value={d}
            onChange={(e) => setAt(idx, e.target.value)}
            onKeyDown={onKeyDown(idx)}
            disabled={disabled}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            aria-label={`Digit ${idx + 1}`}
            aria-invalid={!!error}
            className={cn(
              "h-12 w-11 text-center text-[18px] font-semibold rounded-[var(--pixap-radius-button)]",
              "bg-[var(--pixap-surface)] text-[var(--pixap-text)]",
              "border border-[var(--pixap-border)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--pixap-accent)]",
              error && "border-[var(--pixap-danger)]",
            )}
          />
        ))}
      </div>
      {error ? (
        <span className="text-[12px] text-[var(--pixap-danger)]">{error}</span>
      ) : null}
    </div>
  );
}
