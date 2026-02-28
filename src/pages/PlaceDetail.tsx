import { useState } from "react";
import { ArrowLeft, Star, MapPin, Clock, Phone, Navigation, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBusinessCard } from "@/hooks/useBusinessCards";
import { useReviews } from "@/hooks/useReviews";
import { useAuth } from "@/contexts/AuthContext";
import { useIsFavorite, useToggleFavorite } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DirectionsSheet from "@/components/DirectionsSheet";

const PlaceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: place, isLoading } = useBusinessCard(id || "");
  const { data: reviews = [] } = useReviews(id || "");
  const { user } = useAuth();
  const isFavorite = useIsFavorite(id || "");
  const toggleFavorite = useToggleFavorite();
  const [showDirections, setShowDirections] = useState(false);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!place) return null;

  const handleFavorite = () => {
    if (!user) { navigate("/auth"); return; }
    toggleFavorite.mutate({ businessCardId: place.id, isFavorite });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[280px]">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between safe-top">
          <button onClick={() => navigate(-1)} className="p-2 bg-card/80 backdrop-blur-sm rounded-full">
            <ArrowLeft className="w-5 h-5 text-card-foreground" />
          </button>
          <button onClick={handleFavorite} className="p-2 bg-card/80 backdrop-blur-sm rounded-full">
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : "text-card-foreground"}`} />
          </button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 -mt-8 relative z-10 pb-28">
        <div className="bg-card rounded-2xl p-5 shadow-elevated">
          <h1 className="text-xl font-bold text-card-foreground">{place.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Star className="w-4 h-4 fill-gold text-gold" />
            <span className="text-sm font-semibold text-card-foreground">{Number(place.rating).toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
            <span className="text-xs text-muted-foreground">{Number(place.booking_price).toLocaleString()} ₸</span>
          </div>

          <div className="flex gap-1.5 mt-3">
            {place.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-secondary rounded-full text-secondary-foreground">{tag}</span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{place.description}</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-card-foreground">{place.address}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                if (place.phone) {
                  window.open(`tel:${place.phone}`);
                } else {
                  toast({ title: "Phone number not available", variant: "destructive" });
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-xl text-sm font-medium text-secondary-foreground"
            >
              <Phone className="w-4 h-4" /> Call
            </button>
            <button
              onClick={() => setShowDirections(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-xl text-sm font-medium text-secondary-foreground"
            >
              <Navigation className="w-4 h-4" /> Directions
            </button>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-4 bg-card rounded-2xl p-5 shadow-card">
            <h2 className="text-base font-semibold text-card-foreground mb-3">Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground flex-shrink-0">
                    U
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-card-foreground">User</span>
                      <div className="flex">
                        {Array.from({ length: review.value }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{review.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <div className="fixed bottom-16 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border">
        <div className="flex gap-3 max-w-lg mx-auto">
          {(place.category?.name === "Restaurants" || place.category?.name === "Shopping") && (
            <Button
              variant="secondary"
              onClick={() => navigate(`/shop/${place.id}`)}
              className="flex-1 h-12 text-base font-semibold rounded-xl"
            >
              {place.category?.name === "Restaurants" ? "Menu" : "Shop Items"}
            </Button>
          )}
          <Button
            onClick={() => user ? navigate(`/book/${place.id}`) : navigate("/auth")}
            className="flex-1 h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Book Now
          </Button>
        </div>
      </div>
      <DirectionsSheet
        open={showDirections}
        onOpenChange={setShowDirections}
        placeName={place.name}
        address={place.address}
      />
    </div>
  );
};

export default PlaceDetail;
