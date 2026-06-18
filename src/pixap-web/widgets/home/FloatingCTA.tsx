import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  city: string;
}

export function FloatingCTA({ city }: Props) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setVisible(v > 500));
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <Link
            to="/pixap"
            className="pointer-events-auto inline-flex items-center gap-2 h-12 px-5 rounded-full text-white text-[14px] font-semibold shadow-2xl hover:scale-[1.03] active:scale-95 transition-transform"
            style={{ background: "var(--pixap-gradient-cta)" }}
          >
            <Sparkles size={16} aria-hidden />
            Book something tonight in {city}
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
