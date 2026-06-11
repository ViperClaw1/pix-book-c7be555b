import { TEMPERAMENTS } from "../constants";
import { StepLayout } from "./StepLayout";
import { cn } from "@/pixap-web/shared/lib/cn";

interface Props {
  value: string | null;
  onChange: (v: string) => void;
}

export function TemperamentStep({ value, onChange }: Props) {
  return (
    <StepLayout
      title="How do you like to socialize?"
      subtitle="Helps us match the energy of places."
    >
      <div className="flex flex-col gap-2">
        {TEMPERAMENTS.map((t) => {
          const selected = value === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              aria-pressed={selected}
              className={cn(
                "flex flex-col gap-1 rounded-[var(--pixap-radius-card-sm)] border p-4 text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pixap-accent)]",
                selected
                  ? "border-[var(--pixap-accent)] bg-[var(--pixap-accent)]/10"
                  : "border-[var(--pixap-border)] bg-[var(--pixap-surface)] hover:bg-[var(--pixap-tag-muted)]",
              )}
            >
              <span className="text-[15px] font-semibold text-[var(--pixap-text)]">
                {t.label}
              </span>
              <span className="text-[13px] text-[var(--pixap-text-muted)]">
                {t.description}
              </span>
            </button>
          );
        })}
      </div>
    </StepLayout>
  );
}
