import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PlaceCard from "@/components/PlaceCard";
import { places, categories, type Category } from "@/data/mockData";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const filtered = places.filter((p) => {
    const matchCategory = activeFilter === "all" || p.category === activeFilter;
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
    return matchCategory && matchQuery;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-secondary rounded-xl">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search places…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
          <button className="p-2 bg-secondary rounded-xl">
            <SlidersHorizontal className="w-4 h-4 text-foreground" />
          </button>
        </div>
        {/* Filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === cat.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pt-2">
        <p className="text-xs text-muted-foreground mb-3">{filtered.length} results</p>
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
              <PlaceCard place={p} variant="horizontal" />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-muted-foreground text-sm">No places found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
