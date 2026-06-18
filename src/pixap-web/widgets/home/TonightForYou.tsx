import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useBusinessCards } from "@/pixap-web/entities/business-card/useBusinessCards";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { SectionTitle, EmptyHint } from "./FeaturedSection";
import type { BusinessCard } from "@/pixap-web/entities/business-card/types";

interface Props {
  city?: string;
  categoryId?: string;
}

/**
 * Daily picks.
 * - Mobile: snap-scroll card carousel.
 * - Tablet/desktop: peek carousel showing 1/2 + 1 + 1/2 cards per slide,
 *   navigable via mouse drag/swipe.
 */
export function TonightForYou({ city, categoryId }: Props) {
  const { data, isLoading } = useBusinessCards({ city, categoryId }, 8);
  const cards = data ?? [];

  return (
    <section className="pt-3 pb-1">
      <SectionTitle>Tonight for you</SectionTitle>

      {/* Mobile carousel */}
      <div className="md:hidden px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="shrink-0 snap-center w-[88%] h-[260px] rounded-[var(--pixap-radius-hero)]"
              />
            ))
          : cards.map((card) => (
              <TonightCard key={card.id} card={card} className="shrink-0 snap-center w-[88%] h-[260px]" />
            ))}
        {!isLoading && cards.length === 0 ? (
          <EmptyHint>No picks for tonight yet.</EmptyHint>
        ) : null}
      </div>

      {/* Tablet/desktop peek carousel */}
      <div className="hidden md:block">
        {isLoading ? (
          <div className="px-6">
            <Skeleton className="w-full h-[380px] lg:h-[440px] rounded-[var(--pixap-radius-hero)]" />
          </div>
        ) : cards.length === 0 ? (
          <div className="px-6">
            <EmptyHint>No picks for tonight yet.</EmptyHint>
          </div>
        ) : (
          <PeekCarousel cards={cards} />
        )}
      </div>
    </section>
  );
}

function PeekCarousel({ cards }: { cards: BusinessCard[] }) {
  const [emblaRef] = useEmblaCarousel({
    align: "center",
    loop: cards.length > 2,
    dragFree: false,
    containScroll: cards.length > 2 ? false : "trimSnaps",
  });

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
      <div className="flex">
        {cards.map((card) => (
          <div
            key={card.id}
            className="shrink-0 grow-0 basis-2/3 px-2 first:pl-6 last:pr-6"
          >
            <TonightCard card={card} className="w-full h-[380px] lg:h-[440px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TonightCard({
  card,
  className = "",
}: {
  card: BusinessCard;
  className?: string;
}) {
  return (
    <Link
      to={`/pixap/place/${card.id}`}
      onClick={(e) => {
        // Prevent click after a drag from navigating.
        const target = e.currentTarget as HTMLAnchorElement;
        if (target.dataset.dragging === "true") {
          e.preventDefault();
        }
      }}
      draggable={false}
      className={
        "group relative block rounded-[var(--pixap-radius-hero)] overflow-hidden bg-[var(--pixap-tag-muted)] transition-[filter] duration-200 hover:brightness-105 select-none " +
        className
      }
    >
      {card.image ? (
        <img
          src={card.image}
          alt={card.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] pointer-events-none"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ background: "var(--pixap-gradient-hero)" }}
        aria-hidden
      />
      <div
        className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-semibold"
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
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 text-white">
        <h3 className="text-[18px] md:text-[24px] font-bold leading-tight line-clamp-1">
          {card.name}
        </h3>
        {card.address ? (
          <p className="text-[13px] md:text-[14px] opacity-90 line-clamp-1">
            {card.address}
          </p>
        ) : null}
        <span
          className="hidden md:inline-flex mt-3 items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          style={{ background: "var(--pixap-gradient-cta)" }}
        >
          See details →
        </span>
      </div>
    </Link>
  );
}
