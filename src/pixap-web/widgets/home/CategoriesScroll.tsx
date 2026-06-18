import { motion, LayoutGroup } from "framer-motion";
import { useCategories } from "@/pixap-web/entities/category/useCategories";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { cn } from "@/pixap-web/shared/lib/cn";

interface Props {
  selectedId?: string;
  onSelect: (id?: string) => void;
}

export function CategoriesScroll({ selectedId, onSelect }: Props) {
  const { data, isLoading } = useCategories();
  const activeKey = selectedId ?? "__all";

  return (
    <div
      className={cn(
        "sticky top-[64px] z-20",
        "bg-[var(--pixap-background)]/80 backdrop-blur-xl",
        "px-4 md:px-6 xl:px-10 py-2.5",
        "border-b border-[var(--pixap-border)]/40",
      )}
    >
      {isLoading ? (
        <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible no-scrollbar">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      ) : (
        <LayoutGroup id="pixap-chips">
          <div className="flex gap-2 overflow-x-auto md:flex-wrap md:overflow-visible no-scrollbar">
            <Chip
              id="__all"
              active={activeKey === "__all"}
              onClick={() => onSelect(undefined)}
            >
              All
            </Chip>
            {(data ?? []).map((c) => (
              <Chip
                key={c.id}
                id={c.id}
                active={activeKey === c.id}
                onClick={() =>
                  onSelect(activeKey === c.id ? undefined : c.id)
                }
              >
                {c.name}
              </Chip>
            ))}
          </div>
        </LayoutGroup>
      )}
    </div>
  );
}

function Chip({
  id,
  active,
  children,
  onClick,
}: {
  id: string;
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-chip-id={id}
      className={cn(
        "relative h-9 px-4 shrink-0 rounded-full text-[13px] font-semibold whitespace-nowrap",
        "transition-colors duration-150",
        active
          ? "text-[var(--pixap-background)]"
          : "bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)] hover:text-[var(--pixap-text)]",
      )}
    >
      {active && (
        <motion.span
          layoutId="pixap-chip-bg"
          className="absolute inset-0 rounded-full bg-[var(--pixap-text)]"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
