import { useState } from "react";
import {
  useAllBusinessCards,
  useAllCategories,
  useCreateBusinessCard,
  useUpdateBusinessCard,
  useDeleteBusinessCard,
} from "@/hooks/useAdminData";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "@/components/admin/ImageUploader";
import AddressAutocomplete from "@/components/admin/AddressAutocomplete";
import { toast } from "sonner";
import type { TablesInsert } from "@/integrations/supabase/types";

type CardForm = {
  name: string;
  image: string;
  address: string;
  phone: string;
  category_id: string;
  rating: string;
  booking_price: string;
  tags: string;
  description: string;
  type: "featured" | "recommended";
};

const phoneRegex = /^\+\d{1,3}\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/[^\d]/g, "");
  let result = "";
  if (digits.length > 0) result += "+" + digits.slice(0, Math.min(digits.length, 1));
  if (digits.length > 1) result += " (" + digits.slice(1, Math.min(digits.length, 4));
  if (digits.length >= 4) result += ") ";
  if (digits.length > 4) result += digits.slice(4, Math.min(digits.length, 7));
  if (digits.length > 7) result += "-" + digits.slice(7, Math.min(digits.length, 9));
  if (digits.length > 9) result += "-" + digits.slice(9, Math.min(digits.length, 11));
  return result;
};

const emptyForm: CardForm = { name: "", image: "", address: "", phone: "", category_id: "", rating: "", booking_price: "", tags: "", description: "", type: "recommended" };

const AdminBusinessCards = () => {
  const navigate = useNavigate();
  const { data: cards = [], isLoading } = useAllBusinessCards();
  const { data: categories = [] } = useAllCategories();
  const createCard = useCreateBusinessCard();
  const updateCard = useUpdateBusinessCard();
  const deleteCard = useDeleteBusinessCard();

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CardForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [phoneError, setPhoneError] = useState(false);

  const openAdd = () => { setForm(emptyForm); setDialogMode("add"); setEditId(null); setPhoneError(false); };
  const openEdit = (c: any) => {
    setForm({
      name: c.name, image: c.image ?? "", address: c.address ?? "", phone: c.phone,
      category_id: c.category_id ?? "", rating: String(c.rating), booking_price: String(c.booking_price),
      tags: (c.tags ?? []).join(", "), description: c.description ?? "", type: c.type,
    });
    setEditId(c.id);
    setDialogMode("edit");
    setPhoneError(false);
  };

  const handleSave = async () => {
    if (form.phone && !phoneRegex.test(form.phone)) {
      setPhoneError(true);
      toast.error("Please enter a valid phone number");
      return;
    }
    const payload: TablesInsert<"business_cards"> = {
      name: form.name,
      image: form.image || null,
      address: form.address || null,
      phone: form.phone,
      category_id: form.category_id || null,
      rating: Number(form.rating) || 0,
      booking_price: Number(form.booking_price) || 0,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      description: form.description || null,
      type: form.type,
    };
    try {
      if (dialogMode === "add") {
        await createCard.mutateAsync(payload);
        toast.success("Business card created");
      } else if (editId) {
        await updateCard.mutateAsync({ id: editId, updates: payload });
        toast.success("Business card updated");
      }
      setDialogMode(null);
    } catch { toast.error("Failed to save"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCard.mutateAsync(deleteTarget.id);
      toast.success("Deleted");
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete"); }
  };

  const setField = (k: keyof CardForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const filtered = cards.filter((c) => {
    const matchesCat = catFilter === "all" || c.category_id === catFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || (c.tags ?? []).some((t) => t.toLowerCase().includes(q)) || (c.description ?? "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Business Cards</h2>
        <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search name, tags, keywords…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-6">No cards found</p>
        )}
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg border bg-card p-4 space-y-2 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate(`/admin/${c.id}`)}>
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <span className="font-medium">{c.name}</span>
              <Badge variant="outline">{c.type}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{c.categories?.name ?? "—"}</span>
              <span>★ {c.rating}</span>
            </div>
            <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
              <span className="font-medium">${Number(c.booking_price).toFixed(2)}</span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ id: c.id, name: c.name })}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No cards found</TableCell></TableRow>
            )}
            {filtered.map((c) => (
              <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/admin/${c.id}`)}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.categories?.name ?? "—"}</TableCell>
                <TableCell>{c.rating}</TableCell>
                <TableCell className="text-right">${Number(c.booking_price).toFixed(2)}</TableCell>
                <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                <TableCell className="text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget({ id: c.id, name: c.name })}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={!!dialogMode} onOpenChange={(o) => !o && setDialogMode(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Add Business Card" : "Edit Business Card"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
            <ImageUploader
              value={form.image}
              onUpload={(url) => setField("image", url)}
              onRemove={() => setField("image", "")}
            />
            <AddressAutocomplete value={form.address} onChange={(v) => setField("address", v)} />
            <div className="space-y-1">
              <Input
                placeholder="+1 (234) 567-89-01"
                value={form.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setField("phone", formatted);
                  setPhoneError(false);
                }}
                onBlur={() => {
                  if (form.phone && !phoneRegex.test(form.phone)) setPhoneError(true);
                }}
                className={phoneError ? "border-destructive" : ""}
              />
              {phoneError && <p className="text-xs text-destructive">Format: +X (XXX) XXX-XX-XX</p>}
            </div>
            <Select value={form.category_id || "none"} onValueChange={(v) => setField("category_id", v === "none" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Rating" type="number" value={form.rating} onChange={(e) => setField("rating", e.target.value)} />
              <Input placeholder="Booking Price" type="number" value={form.booking_price} onChange={(e) => setField("booking_price", e.target.value)} />
            </div>
            <Input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setField("tags", e.target.value)} />
            <Textarea placeholder="Description" className="min-h-[100px]" value={form.description} onChange={(e) => setField("description", e.target.value)} />
            <Select value={form.type} onValueChange={(v) => setField("type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="recommended">Recommended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogMode(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={createCard.isPending || updateCard.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Business Card</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.name}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCard.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBusinessCards;
