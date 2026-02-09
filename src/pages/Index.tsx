import { Search, Bell, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryPills from "@/components/CategoryPills";
import PlaceCard from "@/components/PlaceCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useBusinessCards } from "@/hooks/useBusinessCards";
import { useUnreadCount } from "@/hooks/useNotifications";

const Index = () => {
  const navigate = useNavigate();
  const { data: featured = [], isLoading: loadingFeatured } = useBusinessCards("featured");
  const { data: recommended = [], isLoading: loadingRecommended } = useBusinessCards();
  const unreadCount = useUnreadCount();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md safe-top">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">PIX</h1>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs">Almaty, KZ</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="relative p-2 rounded-full bg-secondary">
              <Bell className="w-5 h-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <HeroCarousel />
        </motion.div>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Categories</h2>
          <CategoryPills />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Featured</h2>
            <button onClick={() => navigate("/search")} className="text-xs text-primary font-medium">See all</button>
          </div>
          {loadingFeatured ? (
            <div className="flex gap-3">{[1, 2, 3].map((i) => <div key={i} className="w-[200px] h-[190px] rounded-xl shimmer flex-shrink-0" />)}</div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {featured.map((p) => <PlaceCard key={p.id} place={p} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">Recommended</h2>
          {loadingRecommended ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl shimmer" />)}</div>
          ) : (
            <div className="space-y-3">
              {recommended.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <PlaceCard place={p} variant="horizontal" />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
