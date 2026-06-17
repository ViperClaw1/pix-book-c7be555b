import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { useRecommendedInfinite } from "@/pixap-web/entities/business-card/useBusinessCards";
import {
  useFavoriteIds,
  useToggleFavorite,
} from "@/pixap-web/entities/favorite/useFavorites";
import { usePixapAuth } from "@/pixap-web/app/providers/AuthProvider";
import { Skeleton } from "@/pixap-web/shared/ui/Skeleton";
import { SectionTitle, EmptyHint } from "./FeaturedSection";
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
    const isMd =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { rootMargin: isMd ? "50px" : "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const items = data?.pages.flat() ?? [];

  return (
    <section className="pt-3 pb-8">
      <SectionTitle>Recommended</SectionTitle>
      <div className="px-4 md:px-6 xl:px-10 grid gap-3 md:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[96px] md:h-[220px] rounded-[var(--pixap-radius-card)]"
              />
            ))
          : items.length === 0
            ? (
                <div className="col-span-full">
                  <EmptyHint>No recommendations yet.</EmptyHint>
                </div>
              )
            : items.map((card) => <RecommendedCard key={card.id} card={card} />)}
        {isFetchingNextPage
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={`skel-${i}`}
                className="h-[96px] md:h-[220px] rounded-[var(--pixap-radius-card)]"
              />
            ))
          : null}
      </div>
      <div ref={sentinelRef} className="h-6" aria-hidden />
    </section>
  );
}

function RecommendedCard({ card }: { card: BusinessCard }) {
  return (
    <>
      {/* Mobile horizontal row */}
      <div className="md:hidden">
        <CardRow card={card} />
      </div>
      {/* Tablet/desktop tile */}
      <div className="hidden md:block">
        <CardTile card={card} />
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

function CardTile({ card }: { card: BusinessCard }) {
  const tags = (card.tags ?? []).filter(Boolean).slice(0, 3);
  return (
    <Link
      to={`/pixap/place/${card.id}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--pixap-radius-card)] bg-[var(--pixap-card)] border border-[var(--pixap-border)] transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] bg-[var(--pixap-tag-muted)] overflow-hidden">
        {card.image ? (
          <img
            src={card.image}
            alt={card.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : null}
        {card.rating != null && card.rating > 0 ? (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-[11px] font-semibold">
            <Star size={11} fill="currentColor" aria-hidden />
            {card.rating.toFixed(1)}
          </div>
        ) : null}
        <FavoriteButton cardId={card.id} className="absolute top-2 right-2" />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold leading-[20px] text-[var(--pixap-text)] line-clamp-1">
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
        {card.booking_price != null && Number(card.booking_price) > 0 ? (
          <p className="mt-1 text-[12px] text-[var(--pixap-text-muted)]">
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
    <button
      type="button"
      onClick={onClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      className={
        "h-8 w-8 rounded-full flex items-center justify-center bg-black/55 backdrop-blur text-white transition-transform active:scale-90 " +
        className
      }
    >
      <Heart
        size={15}
        aria-hidden
        fill={isFavorite ? "currentColor" : "none"}
        className={isFavorite ? "text-[var(--pixap-accent)]" : "text-white"}
      />
    </button>
  );
}
