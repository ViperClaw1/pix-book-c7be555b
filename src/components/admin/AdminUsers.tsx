import { useState } from "react";
import { useAllProfiles, useUpdateProfile, useUpdateUserRole, useDeleteUser, useCreateUser } from "@/hooks/useAdminData";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Search, Plus } from "lucide-react";
import { toast } from "sonner";

const roleBadge: Record<string, string> = {
  admin: "bg-primary/10 text-primary border-primary/30",
  partner: "bg-amber-500/10 text-amber-600 border-amber-200",
  buyer: "bg-muted text-muted-foreground border-border",
};

type ProfileWithRole = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: string;
  roleId?: string;
};

const AdminUsers = () => {
  const { data: users = [], isLoading } = useAllProfiles();
  const updateProfile = useUpdateProfile();
  const updateRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const createUser = useCreateUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editUser, setEditUser] = useState<ProfileWithRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProfileWithRole | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("buyer");

  // Edit form state
  const [formName, setFormName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState("buyer");

  const openEdit = (u: ProfileWithRole) => {
    setEditUser(u);
    setFormName(u.first_name);
    setFormLastName(u.last_name);
    setFormEmail(u.email);
    setFormRole(u.role);
  };

  const handleSave = async () => {
    if (!editUser) return;
    try {
      await updateProfile.mutateAsync({ id: editUser.id, updates: { first_name: formName, last_name: formLastName, email: formEmail } });
      if (formRole !== editUser.role) {
        await updateRole.mutateAsync({ userId: editUser.id, role: formRole });
      }
      toast.success("User updated");
      setEditUser(null);
    } catch { toast.error("Failed to update user"); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser.mutateAsync(deleteTarget.id);
      toast.success("User deleted");
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete user"); }
  };

  const handleAdd = async () => {
    try {
      await createUser.mutateAsync({ email: newEmail, password: newPassword, first_name: newFirst, last_name: newLast, role: newRole });
      toast.success("User created");
      setAddOpen(false);
      setNewFirst(""); setNewLast(""); setNewEmail(""); setNewPassword(""); setNewRole("buyer");
    } catch (e: any) { toast.error(e.message || "Failed to create user"); }
  };

  const filtered = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading users…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Users</h2>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="buyer">Buyer</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setAddOpen(true)}><Plus className="w-4 h-4 mr-1" /> Add User</Button>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-6">No users found</p>
        )}
        {filtered.map((u) => (
          <div key={u.id} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">{u.first_name} {u.last_name}</span>
              <Badge variant="outline" className={roleBadge[u.role] ?? ""}>{u.role}</Badge>
            </div>
            <div className="text-sm text-muted-foreground">{u.email}</div>
            <div className="flex justify-end gap-1 pt-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(u as ProfileWithRole)}><Pencil className="w-4 h-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(u as ProfileWithRole)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No users found</TableCell></TableRow>
            )}
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.first_name} {u.last_name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadge[u.role] ?? ""}>{u.role}</Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(u as ProfileWithRole)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setDeleteTarget(u as ProfileWithRole)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details and role.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="First name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <Input placeholder="Last name" value={formLastName} onChange={(e) => setFormLastName(e.target.value)} />
            <Input placeholder="Email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
            <Select value={formRole} onValueChange={setFormRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={updateProfile.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>Are you sure you want to delete {deleteTarget?.first_name} {deleteTarget?.last_name}? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteUser.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Create a new user account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div><Label>First Name</Label><Input value={newFirst} onChange={(e) => setNewFirst(e.target.value)} /></div>
            <div><Label>Last Name</Label><Input value={newLast} onChange={(e) => setNewLast(e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
            <div>
              <Label>Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={createUser.isPending || !newEmail || !newPassword || !newFirst || !newLast}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
