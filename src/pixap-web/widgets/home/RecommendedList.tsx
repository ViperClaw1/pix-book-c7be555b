import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useRecommendedInfinite } from "@/pixap-web/entities/business-card/useBusinessCards";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { SectionTitle, EmptyHint } from "./FeaturedSection";

interface Props {
  city?: string;
  categoryId?: string;
}

export function RecommendedList({ city, categoryId }: Props) {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useRecommendedInfinite(city, categoryId);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flat() ?? [];

  return (
    <section className="pt-3 pb-8">
      <SectionTitle>Recommended</SectionTitle>
      <div className="px-4 flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[96px] rounded-[var(--pixap-radius-card)]" />
          ))
        ) : items.length === 0 ? (
          <EmptyHint>No recommendations yet.</EmptyHint>
        ) : (
          items.map((card) => (
            <Link
              key={card.id}
              to={`/pixap/place/${card.id}`}
              className="flex gap-3 p-2 rounded-[var(--pixap-radius-card)] bg-[var(--pixap-card)] border border-[var(--pixap-border)]"
            >
              <div className="w-[80px] h-[80px] rounded-[var(--pixap-radius-thumb)] overflow-hidden bg-[var(--pixap-tag-muted)] shrink-0">
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0 py-1 flex flex-col">
                <h3 className="text-[15px] font-semibold leading-[20px] text-[var(--pixap-text)] line-clamp-1">
                  {card.name}
                </h3>
                {card.address ? (
                  <p className="text-[12px] text-[var(--pixap-text-muted)] line-clamp-1">
                    {card.address}
                  </p>
                ) : null}
                <div className="mt-auto flex items-center gap-2 text-[12px] text-[var(--pixap-text-muted)]">
                  {card.rating != null && card.rating > 0 ? (
                    <span className="flex items-center gap-1 text-[var(--pixap-text)] font-semibold">
                      <Star size={11} fill="currentColor" aria-hidden />
                      {card.rating.toFixed(1)}
                    </span>
                  ) : null}
                  {card.booking_price != null && Number(card.booking_price) > 0 ? (
                    <span>· from {Number(card.booking_price).toFixed(0)} ₸</span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))
        )}
        <div ref={sentinelRef} className="h-6" aria-hidden />
        {isFetchingNextPage ? (
          <Skeleton className="h-[96px] rounded-[var(--pixap-radius-card)]" />
        ) : null}
      </div>
    </section>
  );
}
