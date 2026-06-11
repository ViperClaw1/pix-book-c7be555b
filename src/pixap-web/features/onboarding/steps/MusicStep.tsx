import { ChoiceChip } from "@/pixap-web/shared/ui/ChoiceChip";
import { MUSIC } from "../constants";
import { StepLayout } from "./StepLayout";

interface Props {
  value: string[];
  onToggle: (v: string) => void;
}

export function MusicStep({ value, onToggle }: Props) {
  return (
    <StepLayout
      title="What sets the mood?"
      subtitle="Pick the sounds you love."
    >
      <div className="flex flex-wrap gap-2">
        {MUSIC.map((m) => (
          <ChoiceChip
            key={m.value}
            selected={value.includes(m.value)}
            onClick={() => onToggle(m.value)}
          >
            {m.label}
          </ChoiceChip>
        ))}
      </div>
    </StepLayout>
  );
}
