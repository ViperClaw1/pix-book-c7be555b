import { useState } from "react";
import { ArrowLeft, Trash2, ShoppingCart, Minus, Plus, ChevronDown, CreditCard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCartItems, useDeleteCartItem } from "@/hooks/useCartItems";
import { useCreateBooking } from "@/hooks/useBookings";
import {
  useShoppingCart,
  useUpdateShoppingCartQuantity,
  useRemoveShoppingCartItem,
  ShoppingCartItem,
} from "@/hooks/useShoppingItems";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const QuantityControls = ({
  quantity,
  onUpdate,
  onRemove,
  f,
}: {
  quantity: number;
  onUpdate: (qty: number) => void;
  onRemove: () => void;
}) => {
  const handleMinus = () => {
    if (quantity <= 1) {
      onRemove();
    } else {
      onUpdate(quantity - 1);
    }
  };
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={handleMinus} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
        <Minus className="w-3.5 h-3.5 text-secondary-foreground" />
      </button>
      <span className="w-5 text-center text-xs font-medium text-card-foreground">{quantity}</span>
      <button
        onClick={() => onUpdate(quantity + 1)}
        className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
      >
        <Plus className="w-3.5 h-3.5 text-primary-foreground" />
      </button>
    </div>
  );
};

const ShoppingCartItemRow = ({
  item,
  updateQty,
  removeItem,
}: {
  item: ShoppingCartItem;
  updateQty: ReturnType<typeof useUpdateShoppingCartQuantity>;
  removeItem: ReturnType<typeof useRemoveShoppingCartItem>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const children = item.children || [];
  const itemTotal =
    (item.shopping_item?.price || 0) * item.quantity +
    children.reduce((s, c) => s + (c.shopping_item?.price || 0) * c.quantity, 0);

  const handleRemoveMain = async () => {
    try {
      await removeItem.mutateAsync(item.id);
      toast.success(`"${item.shopping_item?.name}" removed`);
    } catch {
      toast.error("Failed to remove");
    }
  };

  const handleRemoveChild = async (child: ShoppingCartItem) => {
    try {
      await removeItem.mutateAsync(child.id);
      toast.success(`"${child.shopping_item?.name}" removed`);
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-card overflow-hidden">
      <div className="flex gap-3 p-3">
        {item.shopping_item?.image ? (
          <img
            src={item.shopping_item.image}
            alt={item.shopping_item.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-xl">
            📦
          </div>
        )}
        <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
          <div>
            <h3 className="font-semibold text-card-foreground text-sm truncate">{item.shopping_item?.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {Number(item.shopping_item?.price || 0).toLocaleString()} ₸ × {item.quantity}
            </p>
          </div>
          <QuantityControls
            quantity={item.quantity}
            onUpdate={(qty) => updateQty.mutate({ id: item.id, quantity: qty })}
            onRemove={handleRemoveMain}
          />
        </div>
        <div className="flex flex-col items-end justify-between py-0.5">
          <p className="text-sm font-medium text-card-foreground">{itemTotal.toLocaleString()} ₸</p>
          <button onClick={handleRemoveMain} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
            <Trash2 className="w-4 h-4 text-destructive" />
          </button>
        </div>
      </div>

      {children.length > 0 && (
        <Collapsible open={expanded} onOpenChange={setExpanded}>
          <CollapsibleTrigger className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-secondary/50 transition-colors border-t border-border">
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            Additional items ({children.length})
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-2">
              {children.map((child) => (
                <div key={child.id} className="flex items-center justify-between pl-3 border-l-2 border-border">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-card-foreground truncate">{child.shopping_item?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(child.shopping_item?.price || 0).toLocaleString()} ₸ × {child.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuantityControls
                      quantity={child.quantity}
                      onUpdate={(qty) => updateQty.mutate({ id: child.id, quantity: qty })}
                      onRemove={() => handleRemoveChild(child)}
                    />
                    <button
                      onClick={() => handleRemoveChild(child)}
                      className="p-1 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

const CartPage = () => {
  const navigate = useNavigate();
  const { data: bookingItems = [], isLoading: bookingLoading } = useCartItems();
  const deleteBookingItem = useDeleteCartItem();
  const createBooking = useCreateBooking();
  const { data: shoppingItems = [], isLoading: shoppingLoading } = useShoppingCart();
  const updateQty = useUpdateShoppingCartQuantity();
  const removeItem = useRemoveShoppingCartItem();

  const handleCancelBooking = async (id: string, name?: string) => {
    try {
      await deleteBookingItem.mutateAsync(id);
      toast.success(`"${name || "Item"}" removed from cart`);
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const bookingTotal = bookingItems.reduce((s, i) => s + Number(i.cost), 0);
  const shoppingTotal = shoppingItems.reduce((s, item) => {
    const main = (item.shopping_item?.price || 0) * item.quantity;
    const children = (item.children || []).reduce((cs, c) => cs + (c.shopping_item?.price || 0) * c.quantity, 0);
    return s + main + children;
  }, 0);

  const handleCheckout = async () => {
    try {
      for (const item of bookingItems) {
        await createBooking.mutateAsync({
          business_card_id: item.business_card_id,
          date_time: item.date_time,
          cost: Number(item.cost),
        });
        await deleteBookingItem.mutateAsync(item.id);
      }
      toast.success("Booking confirmed!");
      navigate("/bookings");
    } catch {
      toast.error("Failed to complete booking");
    }
  };

  const hasBookings = bookingItems.length > 0;
  const hasShopping = shoppingItems.length > 0;
  const defaultTab = hasShopping && !hasBookings ? "shopping" : "bookings";

  return (
    <div className="min-h-screen bg-background pb-54">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">My Cart</h1>
        </div>
      </header>

      <main className="px-4">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="bookings" className="flex-1">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="shopping" className="flex-1">
              Shopping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-3">
            {bookingLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-xl shimmer" />
                ))}
              </div>
            ) : bookingItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No booking items</p>
              </div>
            ) : (
              <>
                {bookingItems.map((item, i) => (
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
                        <h3 className="font-semibold text-card-foreground truncate">{item.business_card?.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(item.date_time).toLocaleDateString("en", { month: "short", day: "numeric" })}
                          {" · "}
                          {new Date(item.date_time).toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-card-foreground">{Number(item.cost).toLocaleString()} ₸</p>
                    </div>
                    <button
                      onClick={() => handleCancelBooking(item.id, item.business_card?.name)}
                      className="self-center p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </motion.div>
                ))}
                <div className="fixed bottom-26 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
                  <div className="flex justify-between items-center mb-3 max-w-lg mx-auto">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">{bookingTotal.toLocaleString()} ₸</span>
                  </div>
                  <Button
                    onClick={handleCheckout}
                    disabled={createBooking.isPending}
                    className="w-full h-12 text-base font-semibold rounded-xl max-w-lg mx-auto block"
                  >
                    {createBooking.isPending ? "Processing..." : "Checkout"}
                  </Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="shopping" className="space-y-3">
            {shoppingLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-xl shimmer" />
                ))}
              </div>
            ) : shoppingItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No shopping items</p>
              </div>
            ) : (
              <>
                {shoppingItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ShoppingCartItemRow item={item} updateQty={updateQty} removeItem={removeItem} />
                  </motion.div>
                ))}
                <div className="fixed bottom-16 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
                  <div className="flex justify-between items-center mb-3 max-w-lg mx-auto">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-lg font-bold text-foreground">{shoppingTotal.toLocaleString()} ₸</span>
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        const { data, error } = await supabase.functions.invoke("create-checkout");
                        if (error) throw error;
                        if (data?.url) {
                          window.location.href = data.url;
                        } else {
                          throw new Error("No checkout URL returned");
                        }
                      } catch (e: any) {
                        toast.error(e.message || "Failed to start payment");
                      }
                    }}
                    className="w-full h-12 text-base font-semibold rounded-xl max-w-lg mx-auto flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay {shoppingTotal.toLocaleString()} ₸
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CartPage;
