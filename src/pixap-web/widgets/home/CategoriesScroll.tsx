import { useCategories } from "@/pixap-web/entities/category/useCategories";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";

interface Props {
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export function CategoriesScroll({ selectedId, onSelect }: Props) {
  const { data, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
      <Chip active={!selectedId} onClick={() => onSelect(undefined)}>
        All
      </Chip>
      {(data ?? []).map((c) => (
        <Chip
          key={c.id}
          active={selectedId === c.id}
          onClick={() => onSelect(selectedId === c.id ? undefined : c.id)}
        >
          {c.name}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "h-9 px-4 shrink-0 rounded-full text-[13px] font-semibold whitespace-nowrap transition-colors " +
        (active
          ? "bg-[var(--pixap-text)] text-[var(--pixap-background)]"
          : "bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)]")
      }
    >
      {children}
    </button>
  );
}
