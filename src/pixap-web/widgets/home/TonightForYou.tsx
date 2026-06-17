import { Link } from "react-router-dom";
import { Sparkles, Star } from "lucide-react";
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
 * - Tablet/desktop: CSS "image stack cycle" — cards stack and auto-rotate.
 */
export function TonightForYou({ city, categoryId }: Props) {
  const { data, isLoading } = useBusinessCards({ city, categoryId }, 5);
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

      {/* Tablet/desktop stack-cycle */}
      <div className="hidden md:block px-6">
        {isLoading ? (
          <Skeleton className="w-full h-[380px] lg:h-[460px] rounded-[var(--pixap-radius-hero)]" />
        ) : cards.length === 0 ? (
          <EmptyHint>No picks for tonight yet.</EmptyHint>
        ) : (
          <StackCycle cards={cards.slice(0, 5)} />
        )}
      </div>
    </section>
  );
}

function StackCycle({ cards }: { cards: BusinessCard[] }) {
  const n = cards.length;
  const duration = n * 4; // 4s per card

  return (
    <div
      className="pixap-stack mx-auto w-full max-w-[720px] h-[380px] lg:h-[440px]"
      style={{ ["--pixap-stack-duration" as never]: `${duration}s` }}
    >
      {cards.map((card, i) => (
        <div
          key={card.id}
          style={{ animationDelay: `${-(i * duration) / n}s` }}
        >
          <TonightCard card={card} className="w-full h-full" />
        </div>
      ))}
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
      className={
        "relative block rounded-[var(--pixap-radius-hero)] overflow-hidden bg-[var(--pixap-tag-muted)] " +
        className
      }
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
      </div>
    </Link>
  );
}
