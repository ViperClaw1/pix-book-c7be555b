import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PlaceCard from "@/components/PlaceCard";
import { useBusinessCardsByCategory } from "@/hooks/useBusinessCards";
import { useCategories } from "@/hooks/useCategories";

const CategoryPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: categories = [] } = useCategories();
  const { data: cards = [], isLoading } = useBusinessCardsByCategory(id || "");
  const category = categories.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">
          {category?.icon} {category?.name}
        </h1>
      </header>
      <main className="px-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl shimmer" />)}</div>
        ) : (
          cards.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <PlaceCard place={p} variant="horizontal" />
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
