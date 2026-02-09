import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBusinessCard } from "@/hooks/useBusinessCards";
import { useCreateBooking } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const timeSlots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

const BookingFlow = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: place } = useBusinessCard(id || "");
  const createBooking = useCreateBooking();

  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [guests, setGuests] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!place) return null;

  const totalSteps = 2;

  const canProceed = () => {
    if (step === 0) return guests > 0;
    if (step === 1) return !!selectedTime;
    return true;
  };

  const handleConfirm = async () => {
    const dateTime = new Date(selectedDate);
    const [h, m] = selectedTime.split(":").map(Number);
    dateTime.setHours(h, m, 0, 0);

    try {
      await createBooking.mutateAsync({
        business_card_id: place.id,
        date_time: dateTime.toISOString(),
        cost: Number(place.booking_price),
      });
      setConfirmed(true);
    } catch {
      toast.error("Failed to create booking");
    }
  };

  const dayName = (d: Date) => d.toLocaleDateString("en", { weekday: "short" });
  const dayNum = (d: Date) => d.getDate();

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-2 text-sm">{place.name}</p>
          <p className="text-foreground font-medium mt-1">
            {selectedDate.toLocaleDateString("en", { month: "long", day: "numeric" })} at {selectedTime}
          </p>
          <p className="text-muted-foreground text-sm">{guests} guests</p>
          <Button onClick={() => navigate("/")} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => (step > 0 ? setStep(step - 1) : navigate(-1))} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Book {place.name}</h1>
            <p className="text-xs text-muted-foreground">Step {step + 1} of {totalSteps + 1}</p>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {Array.from({ length: totalSteps + 1 }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-4 pt-4">
          {step === 0 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">Number of Guests</h2>
              <div className="flex items-center justify-center gap-6 py-8">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Minus className="w-5 h-5 text-secondary-foreground" />
                </button>
                <span className="text-5xl font-bold text-foreground w-16 text-center">{guests}</span>
                <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                  <Plus className="w-5 h-5 text-secondary-foreground" />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-3">
                <CalendarDays className="w-4 h-4 inline mr-1" /> Select Date & Time
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((d) => {
                  const isSelected = d.toDateString() === selectedDate.toDateString();
                  return (
                    <button key={d.toISOString()} onClick={() => setSelectedDate(d)}
                      className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[52px] transition-colors ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border border-border"
                      }`}
                    >
                      <span className="text-[10px] uppercase">{dayName(d)}</span>
                      <span className="text-lg font-semibold">{dayNum(d)}</span>
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {timeSlots.map((t) => (
                  <button key={t} onClick={() => setSelectedTime(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selectedTime === t ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground border border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === totalSteps && (
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">Confirm Your Booking</h2>
              <div className="bg-card rounded-2xl p-4 shadow-card space-y-3">
                <div className="flex items-center gap-3">
                  <img src={place.image} alt={place.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <p className="font-semibold text-card-foreground">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.address}</p>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-card-foreground">{selectedDate.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-card-foreground">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span className="font-medium text-card-foreground">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost</span>
                    <span className="font-medium text-card-foreground">{Number(place.booking_price).toLocaleString()} ₸</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
        <Button
          disabled={!canProceed() || createBooking.isPending}
          onClick={() => (step < totalSteps ? setStep(step + 1) : handleConfirm())}
          className="w-full h-12 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
        >
          {createBooking.isPending ? "Creating..." : step < totalSteps ? "Continue" : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
};

export default BookingFlow;
