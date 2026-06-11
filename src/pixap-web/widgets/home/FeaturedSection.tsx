import { useBusinessCards } from "@/pixap-web/entities/business-card/useBusinessCards";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { FeaturedCard } from "./FeaturedCard";

interface Props {
  city?: string;
  categoryId?: string;
}

export function FeaturedSection({ city, categoryId }: Props) {
  const { data, isLoading } = useBusinessCards({ type: "featured", city, categoryId }, 10);

  return (
    <section className="pt-3 pb-1">
      <SectionTitle>Featured</SectionTitle>
      <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="shrink-0 w-[280px] h-[180px] rounded-[var(--pixap-radius-hero)]"
              />
            ))
          : (data ?? []).map((c) => <FeaturedCard key={c.id} card={c} />)}
        {!isLoading && (data ?? []).length === 0 ? (
          <EmptyHint>No featured places yet.</EmptyHint>
        ) : null}
      </div>
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-4 pb-2 text-[17px] font-semibold leading-[22px] text-[var(--pixap-text)]">
      {children}
    </h2>
  );
}

export function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13px] text-[var(--pixap-text-muted)] px-1">{children}</p>
  );
}
