import { ChoiceChip } from "@/pixap-web/shared/ui/ChoiceChip";
import { FREQUENCIES, TIMES } from "../constants";
import { StepLayout } from "./StepLayout";

interface Props {
  frequency: string | null;
  onFrequency: (f: string) => void;
  times: string[];
  onToggleTime: (t: string) => void;
}

export function HabitsStep({
  frequency,
  onFrequency,
  times,
  onToggleTime,
}: Props) {
  return (
    <StepLayout
      title="When do you go out?"
      subtitle="So we can time recommendations right."
    >
      <p className="text-[13px] font-medium text-[var(--pixap-text)]">How often</p>
      <div className="flex flex-wrap gap-2">
        {FREQUENCIES.map((f) => (
          <ChoiceChip
            key={f.value}
            selected={frequency === f.value}
            onClick={() => onFrequency(f.value)}
          >
            {f.label}
          </ChoiceChip>
        ))}
      </div>
      <p className="mt-2 text-[13px] font-medium text-[var(--pixap-text)]">
        Preferred time
      </p>
      <div className="flex flex-wrap gap-2">
        {TIMES.map((t) => (
          <ChoiceChip
            key={t.value}
            selected={times.includes(t.value)}
            onClick={() => onToggleTime(t.value)}
          >
            <span className="mr-1.5">{t.emoji}</span>
            {t.label}
          </ChoiceChip>
        ))}
      </div>
    </StepLayout>
  );
}
