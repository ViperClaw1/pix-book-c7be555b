import { Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingItem } from "@/hooks/useShoppingItems";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mainItem: ShoppingItem | null;
  mainQuantity: number;
  onMainQuantityChange: (qty: number) => void;
  additionalItems: ShoppingItem[];
  selectedAdditionals: Map<string, number>;
  onSelectedAdditionalsChange: (map: Map<string, number>) => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  businessCardId: string;
}

const CartConfirmationSheet = ({
  open,
  onOpenChange,
  mainItem,
  mainQuantity,
  onMainQuantityChange,
  additionalItems,
  selectedAdditionals,
  onSelectedAdditionalsChange,
  onConfirm,
  isLoading,
  businessCardId,
}: Props) => {
  const navigate = useNavigate();

  if (!mainItem) return null;

  const updateAdditionalQty = (id: string, delta: number) => {
    const next = new Map(selectedAdditionals);
    const current = next.get(id) || 0;
    const newQty = Math.max(0, current + delta);
    if (newQty === 0) next.delete(id);
    else next.set(id, newQty);
    onSelectedAdditionalsChange(next);
  };

  const selectedAddItems = additionalItems.filter((i) => selectedAdditionals.has(i.id));

  const total =
    mainItem.price * mainQuantity +
    selectedAddItems.reduce((s, i) => s + i.price * (selectedAdditionals.get(i.id) || 0), 0);

  const handleContinue = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  const handleGoToCart = async () => {
    await onConfirm();
    onOpenChange(false);
    navigate("/cart");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-card-foreground">Added to Cart</SheetTitle>
        </SheetHeader>

        <div className="space-y-3 mt-4">
          {/* Main item */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {mainItem.image ? (
                <img src={mainItem.image} alt={mainItem.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-lg">📦</div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-card-foreground truncate">{mainItem.name}</p>
                <p className="text-xs text-muted-foreground">{Number(mainItem.price).toLocaleString()} ₸</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onMainQuantityChange(Math.max(1, mainQuantity - 1))}
                className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
              >
                <Minus className="w-3.5 h-3.5 text-secondary-foreground" />
              </button>
              <span className="w-5 text-center text-sm font-medium text-card-foreground">{mainQuantity}</span>
              <button
                onClick={() => onMainQuantityChange(mainQuantity + 1)}
                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
              >
                <Plus className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>
          </div>

          {/* Additional items */}
          {selectedAddItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between pl-4 border-l-2 border-border">
              <div className="min-w-0">
                <p className="text-sm text-card-foreground truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{Number(item.price).toLocaleString()} ₸</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateAdditionalQty(item.id, -1)}
                  className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5 text-secondary-foreground" />
                </button>
                <span className="w-5 text-center text-sm font-medium text-card-foreground">
                  {selectedAdditionals.get(item.id) || 0}
                </span>
                <button
                  onClick={() => updateAdditionalQty(item.id, 1)}
                  className="w-7 h-7 rounded-full bg-primary flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-base font-bold text-foreground">{total.toLocaleString()} ₸</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={handleContinue} disabled={isLoading}>
            {isLoading ? "Adding..." : "Continue Shopping"}
          </Button>
          <Button className="flex-1" onClick={handleGoToCart} disabled={isLoading}>
            {isLoading ? "Adding..." : "Go to Cart"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartConfirmationSheet;
