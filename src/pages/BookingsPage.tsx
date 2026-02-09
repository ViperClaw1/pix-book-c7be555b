import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBookings } from "@/hooks/useBookings";

const BookingsPage = () => {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useBookings();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 safe-top">
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">Paid bookings</p>
      </header>

      <main className="px-4 space-y-3 mt-2">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl shimmer" />)}</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-muted-foreground text-sm">No bookings yet</p>
          </div>
        ) : (
          bookings.map((b, i) => (
            <motion.button
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/place/${b.business_card_id}`)}
              className="w-full flex gap-3 p-3 bg-card rounded-xl shadow-card text-left"
            >
              <img src={b.business_card?.image || ""} alt={b.business_card?.name || ""} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex flex-col justify-between py-0.5 min-w-0">
                <div>
                  <h3 className="font-semibold text-card-foreground truncate">{b.business_card?.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <CalendarDays className="w-3 h-3" />
                    <span>{new Date(b.date_time).toLocaleDateString("en", { month: "short", day: "numeric" })}</span>
                    <span>·</span>
                    <span>{new Date(b.date_time).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{Number(b.cost).toLocaleString()} ₸</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full self-start bg-success/10 text-success">
                  Paid
                </span>
              </div>
            </motion.button>
          ))
        )}
      </main>
    </div>
  );
};

export default BookingsPage;
