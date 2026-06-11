import { ChoiceChip } from "@/pixap-web/shared/ui/ChoiceChip";
import { AppSpinner } from "@/pixap-web/shared/ui/AppSpinner";
import { useCategories } from "../useCategories";
import { StepLayout } from "./StepLayout";

interface Props {
  value: string[];
  onToggle: (id: string) => void;
}

export function CategoriesStep({ value, onToggle }: Props) {
  const { data, isLoading, error } = useCategories();
  return (
    <StepLayout
      title="What are you into?"
      subtitle="Pick all that apply. You can change this later."
    >
      {isLoading ? (
        <div className="flex justify-center py-6">
          <AppSpinner />
        </div>
      ) : error ? (
        <p className="text-[13px] text-[var(--pixap-danger)]">
          Couldn't load categories.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data?.map((c) => (
            <ChoiceChip
              key={c.id}
              selected={value.includes(c.id)}
              onClick={() => onToggle(c.id)}
            >
              {c.name}
            </ChoiceChip>
          ))}
        </div>
      )}
    </StepLayout>
  );
}
