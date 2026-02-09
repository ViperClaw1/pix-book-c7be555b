import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useBookings } from "@/hooks/useBookings";

const BookingsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");
  const { data: bookings = [], isLoading } = useBookings();
  
  const filtered = bookings.filter((b) => (tab === "upcoming" ? b.status === "upcoming" : b.status !== "upcoming"));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 safe-top">
        <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
      </header>

      <div className="px-4 flex gap-2 mb-4">
        {(["upcoming", "completed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : "Past"}
          </button>
        ))}
      </div>

      <main className="px-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl shimmer" />)}</div>
        ) : (
          <>
            {filtered.map((b, i) => (
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
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full self-start ${
                      b.status === "upcoming" ? "bg-success/10 text-success"
                      : b.status === "completed" ? "bg-secondary text-secondary-foreground"
                      : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              </motion.button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">📅</p>
                <p className="text-muted-foreground text-sm">No {tab} bookings</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default BookingsPage;
