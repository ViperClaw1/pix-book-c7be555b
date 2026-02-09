import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PlaceCard from "@/components/PlaceCard";
import { useFavorites } from "@/hooks/useFavorites";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { data: favorites = [], isLoading } = useFavorites();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Favorites</h1>
      </header>

      <main className="px-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl shimmer" />)}</div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">❤️</p>
            <p className="text-muted-foreground text-sm">No favorites yet</p>
          </div>
        ) : (
          favorites.map((fav: any, i: number) => fav.business_card && (
            <motion.div key={fav.business_card.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <PlaceCard place={fav.business_card} variant="horizontal" />
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
