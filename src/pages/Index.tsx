import { Search, Bell, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryPills from "@/components/CategoryPills";
import PlaceCard from "@/components/PlaceCard";
import { places } from "@/data/mockData";

const Index = () => {
  const navigate = useNavigate();
  const featured = places.filter((p) => p.isFeatured);
  const recommended = places;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md safe-top">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">PIX</h1>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">Almaty, KZ</span>
            </div>
          </div>
          <button className="relative p-2 rounded-full bg-secondary">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
        </div>
        {/* Search bar */}
        <div className="px-4 pb-3">
          <button
            onClick={() => navigate("/search")}
            className="w-full flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl text-muted-foreground"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search restaurants, salons, events…</span>
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Banner carousel */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <HeroCarousel />
        </motion.div>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">Categories</h2>
          <CategoryPills />
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display font-semibold text-foreground">Featured</h2>
            <button onClick={() => navigate("/search")} className="text-xs text-primary font-medium">See all</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {featured.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </section>

        {/* Recommended */}
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-3">Recommended</h2>
          <div className="space-y-3">
            {recommended.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PlaceCard place={p} variant="horizontal" />
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
