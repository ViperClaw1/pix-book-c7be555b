import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { BusinessCard } from "@/hooks/useBusinessCards";

interface PlaceCardProps {
  place: BusinessCard;
  variant?: "horizontal" | "vertical";
}

const PlaceCard = ({ place, variant = "vertical" }: PlaceCardProps) => {
  const navigate = useNavigate();

  if (variant === "horizontal") {
    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/place/${place.id}`)}
        className="flex gap-3 p-3 bg-card rounded-xl shadow-card w-full text-left"
      >
        <img src={place.image} alt={place.name} className="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
        <div className="flex flex-col justify-between min-w-0 py-0.5">
          <div>
            <h3 className="font-semibold text-card-foreground truncate">{place.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{place.address}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              <span className="text-sm font-semibold text-card-foreground">{Number(place.rating).toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">{Number(place.booking_price).toLocaleString()} ₸</span>
          </div>
          <div className="flex gap-1.5 mt-1">
            {place.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">{tag}</span>
            ))}
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate(`/place/${place.id}`)}
      className="w-[200px] flex-shrink-0 text-left"
    >
      <div className="relative rounded-xl overflow-hidden shadow-card">
        <img src={place.image} alt={place.name} className="w-full h-[140px] object-cover" />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <Star className="w-3 h-3 fill-gold text-gold" />
          <span className="text-xs font-semibold text-card-foreground">{Number(place.rating).toFixed(1)}</span>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="font-semibold text-sm text-foreground truncate">{place.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{place.tags.join(" · ")}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{Number(place.booking_price).toLocaleString()} ₸</p>
      </div>
    </motion.button>
  );
};

export default PlaceCard;
