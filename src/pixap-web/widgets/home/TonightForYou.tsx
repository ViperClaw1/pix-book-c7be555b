import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
import { useBusinessCards } from "@/pixap-web/entities/business-card/useBusinessCards";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { SectionTitle, EmptyHint } from "./FeaturedSection";

interface Props {
  city?: string;
  categoryId?: string;
}

/**
 * Daily picks — for now a server-side sampled subset of featured/recommended
 * venues. Native uses a swipe deck; web shows a snap-scroll card carousel.
 */
export function TonightForYou({ city, categoryId }: Props) {
  const { data, isLoading } = useBusinessCards({ city, categoryId }, 5);

  return (
    <section className="pt-3 pb-1">
      <SectionTitle>Tonight for you</SectionTitle>
      <div className="px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="shrink-0 snap-center w-[88%] h-[260px] rounded-[var(--pixap-radius-hero)]"
              />
            ))
          : (data ?? []).map((card) => (
              <Link
                key={card.id}
                to={`/pixap/place/${card.id}`}
                className="relative shrink-0 snap-center w-[88%] h-[260px] rounded-[var(--pixap-radius-hero)] overflow-hidden bg-[var(--pixap-tag-muted)]"
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
                <div
                  className="absolute inset-0"
                  style={{ background: "var(--pixap-gradient-hero)" }}
                  aria-hidden
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-semibold"
                  style={{ background: "var(--pixap-gradient-cta)" }}
                >
                  <Sparkles size={11} aria-hidden />
                  For you
                </div>
                {card.rating != null && card.rating > 0 ? (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold">
                    <Star size={11} fill="currentColor" aria-hidden />
                    {card.rating.toFixed(1)}
                  </div>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="text-[18px] font-bold leading-tight line-clamp-1">
                    {card.name}
                  </h3>
                  {card.address ? (
                    <p className="text-[13px] opacity-90 line-clamp-1">
                      {card.address}
                    </p>
                  ) : null}
                </div>
              </Link>
            ))}
        {!isLoading && (data ?? []).length === 0 ? (
          <EmptyHint>No picks for tonight yet.</EmptyHint>
        ) : null}
      </div>
    </section>
  );
}
