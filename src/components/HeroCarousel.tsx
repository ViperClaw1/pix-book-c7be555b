import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { banners } from "@/data/mockData";

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % banners.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={banners[current].image}
            alt={banners[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-lg font-display font-bold text-primary-foreground">{banners[current].title}</h2>
            <p className="text-sm text-primary-foreground/80">{banners[current].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-2 right-4 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === current ? "w-4 bg-primary-foreground" : "bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
