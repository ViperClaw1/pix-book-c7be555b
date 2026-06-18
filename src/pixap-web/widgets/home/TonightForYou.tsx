import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBusinessCards } from "@/pixap-web/entities/business-card/useBusinessCards";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { EmptyHint } from "./FeaturedSection";
import { cn } from "@/pixap-web/shared/lib/cn";
import type { BusinessCard } from "@/pixap-web/entities/business-card/types";

interface Props {
  city?: string;
  categoryId?: string;
}

export function TonightForYou({ city, categoryId }: Props) {
  const { data, isLoading } = useBusinessCards({ city, categoryId }, 8);
  const cards = data ?? [];

  return (
    <section className="pt-3 pb-1">

      {/* Mobile: snap-scroll carousel */}
      <div className="md:hidden px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Skeleton
                key={i}
                className="shrink-0 snap-center w-[88%] h-[260px] rounded-[var(--pixap-radius-hero)]"
              />
            ))
          : cards.map((card) => (
              <TonightCard
                key={card.id}
                card={card}
                className="shrink-0 snap-center w-[88%] h-[260px]"
              />
            ))}
        {!isLoading && cards.length === 0 ? (
          <EmptyHint>No picks for tonight yet.</EmptyHint>
        ) : null}
      </div>

      {/* Tablet/desktop: cinematic full-bleed carousel */}
      <div className="hidden md:block px-6 xl:px-10">
        {isLoading ? (
          <Skeleton className="w-full h-[380px] lg:h-[460px] rounded-[var(--pixap-radius-hero)]" />
        ) : cards.length === 0 ? (
          <EmptyHint>No picks for tonight yet.</EmptyHint>
        ) : (
          <CinematicHero cards={cards} />
        )}
      </div>
    </section>
  );
}

function CinematicHero({ cards }: { cards: BusinessCard[] }) {
  const autoplayRef = useRef(
    Autoplay({ delay: 5500, stopOnInteraction: true }),
  );
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: cards.length > 1, align: "center" },
    cards.length > 1 ? [autoplayRef.current] : [],
  );
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="overflow-hidden rounded-[var(--pixap-radius-hero)] cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex">
          {cards.map((card) => (
            <div key={card.id} className="shrink-0 grow-0 basis-full">
              <HeroSlide card={card} />
            </div>
          ))}
        </div>
      </div>

      {cards.length > 1 ? (
        <>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => embla?.scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === selected ? "w-7 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={scrollPrev}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
              "bg-black/55 backdrop-blur text-white flex items-center justify-center",
              "transition-opacity duration-200",
              hovered ? "opacity-100" : "opacity-0",
              "hover:bg-black/75",
            )}
          >
            <ChevronLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={scrollNext}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full",
              "bg-black/55 backdrop-blur text-white flex items-center justify-center",
              "transition-opacity duration-200",
              hovered ? "opacity-100" : "opacity-0",
              "hover:bg-black/75",
            )}
          >
            <ChevronRight size={20} aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}

function HeroSlide({ card }: { card: BusinessCard }) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <Link
      ref={ref}
      to={`/pixap/place/${card.id}`}
      draggable={false}
      onClick={(e) => {
        const t = e.currentTarget as HTMLAnchorElement;
        if (t.dataset.dragging === "true") e.preventDefault();
      }}
      className="relative block h-[380px] lg:h-[460px] overflow-hidden bg-[var(--pixap-tag-muted)] select-none"
    >
      {card.image ? (
        <motion.img
          src={card.image}
          alt={card.name}
          loading="lazy"
          draggable={false}
          style={{ y }}
          className="absolute inset-0 w-full h-[120%] object-cover pointer-events-none"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden
      />

      <div
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[12px] font-semibold shadow-lg"
        style={{ background: "var(--pixap-gradient-cta)" }}
      >
        <Sparkles size={12} aria-hidden />
        Tonight for you
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8 text-white">
        {card.rating != null && card.rating > 0 ? (
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur text-[11px] font-semibold">
              <Star size={11} fill="currentColor" aria-hidden />
              {card.rating.toFixed(1)}
            </span>
          </div>
        ) : null}
        <h3 className="text-[26px] lg:text-[34px] font-bold leading-tight line-clamp-1">
          {card.name}
        </h3>
        {card.address ? (
          <p className="mt-1 text-[14px] opacity-90 line-clamp-1">
            {card.address}
          </p>
        ) : null}
        <span
          className="inline-flex mt-4 items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold"
          style={{ background: "var(--pixap-gradient-cta)" }}
        >
          Book now →
        </span>
      </div>
    </Link>
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
      draggable={false}
      className={cn(
        "group relative block rounded-[var(--pixap-radius-hero)] overflow-hidden bg-[var(--pixap-tag-muted)] select-none",
        className,
      )}
    >
      {card.image ? (
        <img
          src={card.image}
          alt={card.name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : null}
      <div
        className="absolute inset-0"
        style={{ background: "var(--pixap-gradient-hero)" }}
        aria-hidden
      />
      <div
        className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-[11px] font-semibold shadow-lg"
        style={{ background: "var(--pixap-gradient-cta)" }}
      >
        <Sparkles size={11} aria-hidden />
        Tonight for you
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
          <p className="text-[13px] opacity-90 line-clamp-1">{card.address}</p>
        ) : null}
      </div>
    </Link>
  );
}
