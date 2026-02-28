import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useBusinessCard } from "@/hooks/useBusinessCards";
import { useShoppingItems, useAdditionalItems, useAddToShoppingCart, ShoppingItem } from "@/hooks/useShoppingItems";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AdditionalItemsSheet from "@/components/AdditionalItemsSheet";
import CartConfirmationSheet from "@/components/CartConfirmationSheet";

const ShoppingItemsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: place, isLoading: placeLoading } = useBusinessCard(id || "");
  const { data: items = [], isLoading } = useShoppingItems(id || "");
  const { data: additionalItems = [] } = useAdditionalItems(id || "");
  const addToCart = useAddToShoppingCart();

  const [selectedItem, setSelectedItem] = useState<ShoppingItem | null>(null);
  const [showAdditionals, setShowAdditionals] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mainQuantity, setMainQuantity] = useState(1);
  const [selectedAdditionals, setSelectedAdditionals] = useState<Map<string, number>>(new Map());

  const isRestaurant = place?.category?.name === "Restaurants";

  const handleAddToCart = (item: ShoppingItem) => {
    if (!user) { navigate("/auth"); return; }
    setSelectedItem(item);
    setMainQuantity(1);
    setSelectedAdditionals(new Map());

    if (isRestaurant && additionalItems.length > 0) {
      setShowAdditionals(true);
    } else {
      setShowConfirmation(true);
    }
  };

  const handleAdditionalsComplete = (selected: Map<string, number>) => {
    setSelectedAdditionals(selected);
    setShowAdditionals(false);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedItem || !id) return;
    try {
      const mainItems = [{ shopping_item_id: selectedItem.id, business_card_id: id, quantity: mainQuantity }];
      const result = await addToCart.mutateAsync(mainItems);
      const parentId = result[0].id;

      // Add additional items
      const addItems = Array.from(selectedAdditionals.entries())
        .filter(([, qty]) => qty > 0)
        .map(([itemId, qty]) => ({
          shopping_item_id: itemId,
          business_card_id: id,
          quantity: qty,
          parent_id: parentId,
        }));

      if (addItems.length > 0) {
        await addToCart.mutateAsync(addItems);
      }

      toast.success(`${selectedItem.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  if (placeLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-4 pt-3 pb-3 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {isRestaurant ? "Menu" : "Shop Items"}
            </h1>
            <p className="text-xs text-muted-foreground">{place?.name}</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-3 p-3 bg-card rounded-xl shadow-card"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
            )}
            <div className="flex flex-col justify-between py-0.5 min-w-0 flex-1">
              <div>
                <h3 className="font-semibold text-card-foreground truncate">{item.name}</h3>
                <p className="text-sm font-medium text-primary mt-1">
                  {Number(item.price).toLocaleString()} ₸
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => handleAddToCart(item)}
                className="self-start mt-1 h-8 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add to Cart
              </Button>
            </div>
          </motion.div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">No items available</p>
          </div>
        )}
      </main>

      <AdditionalItemsSheet
        open={showAdditionals}
        onOpenChange={setShowAdditionals}
        items={additionalItems}
        onComplete={handleAdditionalsComplete}
      />

      <CartConfirmationSheet
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        mainItem={selectedItem}
        mainQuantity={mainQuantity}
        onMainQuantityChange={setMainQuantity}
        additionalItems={additionalItems}
        selectedAdditionals={selectedAdditionals}
        onSelectedAdditionalsChange={setSelectedAdditionals}
        onConfirm={handleConfirm}
        isLoading={addToCart.isPending}
        businessCardId={id || ""}
      />
    </div>
  );
};

export default ShoppingItemsPage;
