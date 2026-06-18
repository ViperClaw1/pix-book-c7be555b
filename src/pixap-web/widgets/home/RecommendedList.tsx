import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useRecommendedInfinite } from "@/pixap-web/entities/business-card/useBusinessCards";
import {
  useFavoriteIds,
  useToggleFavorite,
} from "@/pixap-web/entities/favorite/useFavorites";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { EmptyHint } from "./FeaturedSection";
import { cn } from "@/pixap-web/shared/lib/cn";
import { BlurImage } from "@/pixap-web/shared/ui/BlurImage";
import type { BusinessCard } from "@/pixap-web/entities/business-card/types";

interface Props {
  city?: string;
  categoryId?: string;
}

export function RecommendedList({ city, categoryId }: Props) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRecommendedInfinite(city, categoryId);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    // Mobile only — use button on desktop.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      return;
    }
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
      <div className="px-4 md:px-6 xl:px-10 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[96px] md:h-[260px] rounded-[var(--pixap-radius-card)]"
              />
            ))
          : items.length === 0
            ? (
                <div className="col-span-full">
                  <EmptyHint>No recommendations yet.</EmptyHint>
                </div>
              )
            : items.map((card, i) => {
                const wide = (i + 1) % 7 === 0;
                return (
                  <RevealWrapper
                    key={card.id}
                    index={i}
                    className={cn("h-full", wide && "md:col-span-2 lg:col-span-2")}
                  >
                    <RecommendedCard card={card} wide={wide} />
                  </RevealWrapper>
                );
              })}
        {isFetchingNextPage
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`skel-${i}`}
                className="h-[96px] md:h-[260px] rounded-[var(--pixap-radius-card)]"
              />
            ))
          : null}
      </div>

      {/* Mobile: infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-6 md:hidden" aria-hidden />

      {/* Desktop: explicit "Show more" button */}
      {!isLoading && hasNextPage ? (
        <div className="hidden md:flex justify-center pt-6">
          <button
            type="button"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
            className={cn(
              "h-10 px-6 rounded-full border border-[var(--pixap-border)]",
              "text-[13px] font-semibold text-[var(--pixap-text)]",
              "hover:bg-[var(--pixap-tag-muted)] transition-colors",
              "disabled:opacity-50",
            )}
          >
            {isFetchingNextPage ? "Loading…" : "Show more places"}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function RevealWrapper({
  children,
  index,
  className = "",
}: {
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: (index % 6) * 0.05,
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RecommendedCard({
  card,
  wide,
}: {
  card: BusinessCard;
  wide?: boolean;
}) {
  return (
    <>
      {/* Mobile horizontal row */}
      <div className="md:hidden h-full">
        <CardRow card={card} />
      </div>
      {/* Tablet/desktop tile (wide spans 2 cols on lg+) */}
      <div className="hidden md:block h-full">
        <CardTile card={card} wide={wide} />
      </div>
    </>
  );
}

function CardRow({ card }: { card: BusinessCard }) {
  return (
    <Link
      to={`/pixap/place/${card.id}`}
      className="relative flex gap-3 p-2 rounded-[var(--pixap-radius-card)] bg-[var(--pixap-card)] border border-[var(--pixap-border)] transition-colors hover:bg-[var(--pixap-tag-muted)]"
    >
      <div className="relative w-[80px] h-[80px] rounded-[var(--pixap-radius-thumb)] overflow-hidden bg-[var(--pixap-tag-muted)] shrink-0">
        {card.image ? (
          <BlurImage src={card.image} alt={card.name} loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={24} className="text-[var(--pixap-border)]" aria-hidden />
          </div>
        )}

      </div>
      <div className="flex-1 min-w-0 py-1 flex flex-col">
        <h3 className="text-[15px] font-semibold leading-[20px] text-[var(--pixap-text)] line-clamp-1 pr-8">
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
      <FavoriteButton cardId={card.id} className="absolute top-2 right-2" />
    </Link>
  );
}

function CardTile({ card, wide }: { card: BusinessCard; wide?: boolean }) {
  const tags = (card.tags ?? []).filter(Boolean).slice(0, wide ? 4 : 3);
  return (
    <Link
      to={`/pixap/place/${card.id}`}
      className={cn(
        "group relative flex flex-col h-full overflow-hidden rounded-[var(--pixap-radius-card)]",
        "bg-[var(--pixap-card)] border border-[var(--pixap-border)]",
        "transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5",
        "min-h-[260px]",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--pixap-tag-muted)] shrink-0",
          wide ? "h-[280px]" : "aspect-[16/10]",
        )}
      >
        {card.image ? (
          <BlurImage
            src={card.image}
            alt={card.name}
            loading="lazy"
            className="transition-transform duration-500 group-hover:scale-[1.06] group-hover:brightness-[1.05]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={32} className="text-[var(--pixap-border)]" aria-hidden />
          </div>
        )}
        {card.rating != null && card.rating > 0 ? (

          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur text-white text-[11px] font-semibold">
            <Star size={11} fill="currentColor" aria-hidden />
            {card.rating.toFixed(1)}
          </div>
        ) : null}
        <FavoriteButton cardId={card.id} className="z-10 absolute top-2 right-2" />
      </div>
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <h3
          className={cn(
            "font-semibold leading-[20px] text-[var(--pixap-text)] line-clamp-1",
            wide ? "text-[17px]" : "text-[15px]",
          )}
        >
          {card.name}
        </h3>
        {card.address ? (
          <p className="text-[12px] text-[var(--pixap-text-muted)] line-clamp-1">
            {card.address}
          </p>
        ) : null}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[var(--pixap-tag-muted)] text-[var(--pixap-tag-muted-text)]"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {wide && card.description ? (
          <p className="text-[12px] text-[var(--pixap-text-muted)] line-clamp-2 pt-0.5">
            {card.description}
          </p>
        ) : null}
        {card.booking_price != null && Number(card.booking_price) > 0 ? (
          <p className="mt-auto pt-1 text-[12px] text-[var(--pixap-text-muted)]">
            from {Number(card.booking_price).toFixed(0)} ₸
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function FavoriteButton({
  cardId,
  className = "",
}: {
  cardId: string;
  className?: string;
}) {
  const { user } = usePixapAuth();
  const navigate = useNavigate();
  const { data: favIds } = useFavoriteIds();
  const toggle = useToggleFavorite();
  const isFavorite = favIds?.has(cardId) ?? false;

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/pixap/auth");
      return;
    }
    toggle.mutate({ businessCardId: cardId, isFavorite });
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      whileTap={{ scale: 1.35 }}
      transition={{ type: "spring", stiffness: 500, damping: 14 }}
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center bg-black/55 backdrop-blur text-white",
        className,
      )}
    >
      <Heart
        size={15}
        aria-hidden
        fill={isFavorite ? "currentColor" : "none"}
        className={isFavorite ? "text-[var(--pixap-accent)]" : "text-white"}
      />
    </motion.button>
  );
}
