import { ChoiceChip } from "@/pixap-web/shared/ui/ChoiceChip";
import { AppInput } from "@/pixap-web/shared/ui/AppInput";
import { CITIES } from "../constants";
import { StepLayout } from "./StepLayout";

interface Props {
  value: string | null;
  onChange: (city: string) => void;
}

export function CityStep({ value, onChange }: Props) {
  const isCustom = value !== null && !CITIES.includes(value);
  return (
    <StepLayout
      title="Where are you based?"
      subtitle="We'll show places near you first."
    >
      <div className="flex flex-wrap gap-2">
        {CITIES.map((c) => (
          <ChoiceChip
            key={c}
            selected={value === c}
            onClick={() => onChange(c)}
          >
            {c}
          </ChoiceChip>
        ))}
      </div>
      <AppInput
        label="Or type a city"
        placeholder="e.g. Tbilisi"
        value={isCustom ? value ?? "" : ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </StepLayout>
  );
}
