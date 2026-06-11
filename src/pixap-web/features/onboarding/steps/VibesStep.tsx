import { ChoiceChip } from "@/pixap-web/shared/ui/ChoiceChip";
import { VIBES } from "../constants";
import { StepLayout } from "./StepLayout";

interface Props {
  value: string[];
  onToggle: (v: string) => void;
}

export function VibesStep({ value, onToggle }: Props) {
  return (
    <StepLayout
      title="What's your vibe?"
      subtitle="Pick the moods that match you best."
    >
      <div className="flex flex-wrap gap-2">
        {VIBES.map((v) => (
          <ChoiceChip
            key={v.value}
            selected={value.includes(v.value)}
            onClick={() => onToggle(v.value)}
            size="lg"
          >
            <span className="mr-1.5">{v.emoji}</span>
            {v.label}
          </ChoiceChip>
        ))}
      </div>
    </StepLayout>
  );
}
