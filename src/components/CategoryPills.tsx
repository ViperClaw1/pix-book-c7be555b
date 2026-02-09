import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "@/data/mockData";

const CategoryPills = () => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/category/${cat.id}`)}
          className="flex items-center gap-2 px-4 py-3 bg-card rounded-xl shadow-card flex-shrink-0 min-w-[120px]"
        >
          <span className="text-2xl">{cat.icon}</span>
          <div className="text-left">
            <p className="text-sm font-semibold text-card-foreground">{cat.label}</p>
            <p className="text-[10px] text-muted-foreground">{cat.count} places</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryPills;
