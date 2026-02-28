import { useParams, useNavigate } from "react-router-dom";
import { useBusinessCard } from "@/hooks/useBusinessCards";
import { useAdminShoppingItems, useCreateShoppingItem, useDeleteShoppingItem } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/admin/ImageUploader";
import { ArrowLeft, Plus, Star, StarHalf, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const StarRating = ({ rating }: {rating: number;}) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} className="w-5 h-5 fill-primary text-primary" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} className="w-5 h-5 fill-primary text-primary" />);
    } else {
      stars.push(<Star key={i} className="w-5 h-5 text-muted-foreground/30" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const AdminBusinessCardDetail = () => {
  const { id } = useParams<{id: string;}>();
  const navigate = useNavigate();
  const { data: card, isLoading } = useBusinessCard(id!);
  const { data: items = [] } = useAdminShoppingItems(id!);
  const createItem = useCreateShoppingItem();
  const deleteItem = useDeleteShoppingItem();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemForm, setItemForm] = useState({ name: "", image: "", price: "", item_type: "main" as "main" | "sauce" | "beverage" });
  const [deleteTarget, setDeleteTarget] = useState<{id: string;name: string;} | null>(null);

  const isRestaurant = card?.category?.name?.toLowerCase() === "restaurants";

  const handleAddItem = async () => {
    if (!itemForm.name.trim()) {toast.error("Name is required");return;}
    try {
      await createItem.mutateAsync({
        business_card_id: id!,
        name: itemForm.name.trim(),
        image: itemForm.image || null,
        price: Number(itemForm.price) || 0,
        item_type: isRestaurant ? itemForm.item_type : "main"
      });
      toast.success("Item added");
      setDialogOpen(false);
      setItemForm({ name: "", image: "", price: "", item_type: "main" });
    } catch {
      toast.error("Failed to add item");
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem.mutateAsync(deleteTarget.id);
      toast.success("Item deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading…</div>;
  if (!card) return <div className="p-6 text-muted-foreground">Business card not found.</div>;

  return (
    <div className="space-y-6 py-[20px] px-[30px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">{card.name}</h1>
      </div>

      {/* Photo */}
      {card.image ?
      <div className="rounded-lg overflow-hidden border bg-muted h-[240px]">
          <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
        </div> :

      <div className="rounded-lg border bg-muted h-[240px] flex items-center justify-center text-muted-foreground">
          No photo
        </div>
      }

      {/* Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {card.category && <Badge>{card.category.name}</Badge>}
          {(card.tags ?? []).map((tag) =>
          <Badge key={tag} variant="secondary">{tag}</Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          <StarRating rating={card.rating} />
          <span className="text-sm text-muted-foreground">{card.rating}</span>
        </div>

        <p className="text-lg font-semibold">${Number(card.booking_price).toFixed(2)}</p>

        {card.description &&
        <p className="text-muted-foreground whitespace-pre-wrap">{card.description}</p>
        }
      </div>

      {/* Items section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isRestaurant ? "Menu Items" : "Shopping Items"}
          </h2>
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            {isRestaurant ? "Add Menu" : "Add Items"}
          </Button>
        </div>

        {items.length === 0 &&
        <p className="text-center text-muted-foreground py-6">No items yet.</p>
        }

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) =>
          <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              {item.image ?
            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" /> :

            <div className="w-14 h-14 rounded-md bg-muted flex-shrink-0" />
            }
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>${Number(item.price).toFixed(2)}</span>
                  {isRestaurant && <Badge variant="outline" className="text-xs">{item.item_type}</Badge>}
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ id: item.id, name: item.name })}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isRestaurant ? "Add Menu Item" : "Add Item"}</DialogTitle>
            <DialogDescription>Fill in the item details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input value={itemForm.name} onChange={(e) => setItemForm((p) => ({ ...p, name: e.target.value }))} placeholder="Item name" />
            </div>
            <div className="space-y-1.5">
              <Label>Image</Label>
              <ImageUploader
                value={itemForm.image}
                onUpload={(url) => setItemForm((p) => ({ ...p, image: url }))}
                onRemove={() => setItemForm((p) => ({ ...p, image: "" }))} />

            </div>
            <div className="space-y-1.5">
              <Label>Price</Label>
              <Input type="number" value={itemForm.price} onChange={(e) => setItemForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" />
            </div>
            {isRestaurant &&
            <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={itemForm.item_type} onValueChange={(v) => setItemForm((p) => ({ ...p, item_type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main</SelectItem>
                    <SelectItem value="sauce">Sauce</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={createItem.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Item Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>Delete "{deleteTarget?.name}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteItem} disabled={deleteItem.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>);

};

export default AdminBusinessCardDetail;