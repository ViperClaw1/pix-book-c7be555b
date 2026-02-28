import { useAllBookings } from "@/hooks/useAdminData";
import { format } from "date-fns";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 border-blue-200",
  completed: "bg-green-500/10 text-green-600 border-green-200",
  expired: "bg-muted text-muted-foreground border-border",
};

const AdminTransactions = () => {
  const { data: bookings = [], isLoading } = useAllBookings();

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading transactions…</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transactions</h2>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Business</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No transactions yet</TableCell></TableRow>
            )}
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="whitespace-nowrap">{format(new Date(b.date_time), "MMM d, yyyy")}</TableCell>
                <TableCell>
                  <div className="font-medium">{b.profile ? `${b.profile.first_name} ${b.profile.last_name}` : "—"}</div>
                  <div className="text-xs text-muted-foreground">{b.profile?.email}</div>
                </TableCell>
                <TableCell>{b.business_cards?.name ?? "—"}</TableCell>
                <TableCell className="text-right font-medium">${Number(b.cost).toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColor[b.status] ?? ""}>{b.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminTransactions;
