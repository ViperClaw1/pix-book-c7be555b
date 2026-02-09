import { ArrowLeft, Trash2, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartItems, useDeleteCartItem } from "@/hooks/useCartItems";
import { useCreateBooking } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CartPage = () => {
  const navigate = useNavigate();
  const { data: items = [], isLoading } = useCartItems();
  const deleteItem = useDeleteCartItem();
  const createBooking = useCreateBooking();

  const handleCancel = async (id: string, name?: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success(`"${name || "Item"}" removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const total = items.reduce((s, i) => s + Number(i.cost), 0);

  const handleCheckout = async () => {
    try {
      for (const item of items) {
        await createBooking.mutateAsync({
          business_card_id: item.business_card_id,
          date_time: item.date_time,
          cost: Number(item.cost),
        });
        await deleteItem.mutateAsync(item.id);
      }
      toast.success("Booking confirmed!");
      navigate("/bookings");
    } catch {
      toast.error("Failed to complete booking");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Cart</h1>
        </div>
      </header>

      <main className="px-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl shimmer" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
          </div>
        ) : (
          items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3 p-3 bg-card rounded-xl shadow-card"
            >
              <img
                src={item.business_card?.image || ""}
                alt={item.business_card?.name || ""}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/place/${item.business_card_id}`)}
              />
              <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
                <div>
                  <h3 className="font-semibold text-card-foreground truncate">
                    {item.business_card?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(item.date_time).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    {" · "}
                    {new Date(item.date_time).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="text-sm font-medium text-card-foreground">
                  {Number(item.cost).toLocaleString()} ₸
                </p>
              </div>
              <button
                onClick={() => handleCancel(item.id, item.business_card?.name)}
                className="self-center p-2 rounded-lg hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </motion.div>
          ))
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
          <div className="flex justify-between items-center mb-3 max-w-lg mx-auto">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold text-foreground">{total.toLocaleString()} ₸</span>
          </div>
          <Button
            onClick={handleCheckout}
            disabled={createBooking.isPending}
            className="w-full h-12 text-base font-semibold rounded-xl max-w-lg mx-auto block"
          >
            {createBooking.isPending ? "Processing..." : "Checkout"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
