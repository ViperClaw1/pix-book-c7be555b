import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingItem } from "@/hooks/useShoppingItems";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ShoppingItem[];
  onComplete: (selected: Map<string, number>) => void;
}

const AdditionalItemsSheet = ({ open, onOpenChange, items, onComplete }: Props) => {
  const [selected, setSelected] = useState<Map<string, number>>(new Map());

  const sauces = items.filter((i) => i.item_type === "sauce");
  const beverages = items.filter((i) => i.item_type === "beverage");

  const updateQty = (id: string, delta: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      const current = next.get(id) || 0;
      const newQty = Math.max(0, current + delta);
      if (newQty === 0) next.delete(id);
      else next.set(id, newQty);
      return next;
    });
  };

  const handleAdd = () => {
    onComplete(selected);
    setSelected(new Map());
  };

  const handleSkip = () => {
    onComplete(new Map());
    setSelected(new Map());
  };

  const renderSection = (title: string, sectionItems: ShoppingItem[]) => {
    if (sectionItems.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
        {sectionItems.map((item) => {
          const qty = selected.get(item.id) || 0;
          return (
            <div key={item.id} className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium text-card-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground ml-2">{Number(item.price).toLocaleString()} ₸</span>
              </div>
              <div className="flex items-center gap-2">
                {qty > 0 ? (
                  <>
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                      <Minus className="w-3.5 h-3.5 text-secondary-foreground" />
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-card-foreground">{qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-primary-foreground" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-card-foreground">Add extras?</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {renderSection("Sauces", sauces)}
          {renderSection("Beverages", beverages)}
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" className="flex-1" onClick={handleSkip}>
            Skip
          </Button>
          <Button className="flex-1" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdditionalItemsSheet;
