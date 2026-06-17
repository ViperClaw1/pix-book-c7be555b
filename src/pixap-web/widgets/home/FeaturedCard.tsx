import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { BusinessCard } from "@/pixap-web/entities/business-card/types";

export function FeaturedCard({ card, fluid = false }: { card: BusinessCard; fluid?: boolean }) {
  return (
    <Link
      to={`/pixap/place/${card.id}`}
      className={
        "relative overflow-hidden bg-[var(--pixap-tag-muted)] rounded-[var(--pixap-radius-hero)] transition-[filter] duration-200 hover:brightness-110 " +
        (fluid ? "block w-full aspect-[16/10]" : "shrink-0 w-[280px] h-[180px]")
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
      {card.rating != null && card.rating > 0 ? (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 text-white text-[11px] font-semibold">
          <Star size={11} fill="currentColor" aria-hidden />
          {card.rating.toFixed(1)}
        </div>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
        <h3 className="text-[15px] font-semibold leading-tight line-clamp-1">
          {card.name}
        </h3>
        {card.address ? (
          <p className="text-[12px] opacity-85 line-clamp-1">{card.address}</p>
        ) : null}
      </div>
    </Link>
  );
}
