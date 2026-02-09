import { ArrowLeft, Star, MapPin, Clock, Phone, Navigation, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { places } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const PlaceDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const place = places.find((p) => p.id === id);

  if (!place) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Cover image with parallax feel */}
      <div className="relative h-[280px]">
        <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between safe-top">
          <button onClick={() => navigate(-1)} className="p-2 bg-card/80 backdrop-blur-sm rounded-full">
            <ArrowLeft className="w-5 h-5 text-card-foreground" />
          </button>
          <button className="p-2 bg-card/80 backdrop-blur-sm rounded-full">
            <Heart className="w-5 h-5 text-card-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 -mt-8 relative z-10 pb-28"
      >
        <div className="bg-card rounded-2xl p-5 shadow-elevated">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-card-foreground">{place.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gold text-gold" />
                  <span className="text-sm font-semibold text-card-foreground">{place.rating}</span>
                  <span className="text-xs text-muted-foreground">({place.reviewCount} reviews)</span>
                </div>
                <span className="text-xs text-muted-foreground">{place.priceRange}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 mt-3">
            {place.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 bg-secondary rounded-full text-secondary-foreground">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{place.description}</p>

          {/* Info rows */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-card-foreground">{place.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-card-foreground">{place.openHours}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-card-foreground">{place.phone}</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-xl text-sm font-medium text-secondary-foreground">
              <Phone className="w-4 h-4" /> Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-xl text-sm font-medium text-secondary-foreground">
              <Navigation className="w-4 h-4" /> Directions
            </button>
          </div>
        </div>

        {/* Reviews preview */}
        <div className="mt-4 bg-card rounded-2xl p-5 shadow-card">
          <h2 className="text-base font-semibold text-card-foreground mb-3">Reviews</h2>
          <div className="space-y-3">
            {[
              { name: "Alex K.", text: "Amazing experience! Will definitely come back.", rating: 5 },
              { name: "Maria S.", text: "Great atmosphere and friendly staff.", rating: 4 },
            ].map((review, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-card-foreground">{review.name}</span>
                    <div className="flex">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fixed booking button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
        <Button
          onClick={() => navigate(`/book/${place.id}`)}
          className="w-full h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
};

export default PlaceDetail;
