import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { orders, matches } from "@/data/mockData";
import { format } from "date-fns";

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  refunded: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [matchFilter, setMatchFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const s = `${o.buyerName} ${o.id}`.toLowerCase().includes(search.toLowerCase());
    const st = statusFilter === "all" || o.status === statusFilter;
    const mf = matchFilter === "all" || o.matchId === matchFilter;
    const pf = paymentFilter === "all" || o.paymentMethod === paymentFilter;
    return s && st && mf && pf;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-primary">FAZ Orders & Tickets</h2>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search buyer or order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={matchFilter} onValueChange={setMatchFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Matches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matches</SelectItem>
            {matches.map(m => <SelectItem key={m.id} value={m.id}>{m.homeTeam} vs {m.awayTeam}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pay</SelectItem>
            <SelectItem value="MTN">MTN</SelectItem>
            <SelectItem value="Airtel">Airtel</SelectItem>
            <SelectItem value="Zamtel">Zamtel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-sidebar-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Wing Selection</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => {
                const match = matches.find(m => m.id === order.matchId);
                return (
                  <TableRow key={order.id} className="hover:bg-slate-50/30">
                    <TableCell className="font-mono text-[10px] text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</TableCell>
                    <TableCell className="font-medium text-sm">{order.buyerName}</TableCell>
                    <TableCell className="text-xs">{match ? `${match.homeTeam} vs ${match.awayTeam}` : "-"}</TableCell>
                    {/* Changed Zone to Wing */}
                    <TableCell className="text-xs font-semibold">{order.zone}</TableCell> 
                    <TableCell>{order.seats}</TableCell>
                    <TableCell className="font-bold">K {order.amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className="font-normal">{order.paymentMethod}</Badge></TableCell>
                    <TableCell><Badge variant="secondary" className={`${statusColor[order.status]} border-none shadow-none text-[10px] uppercase font-bold`}>{order.status}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(order.createdAt), "dd MMM, HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild><Button variant="outline" size="sm" className="h-8 text-xs">View Ticket</Button></DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <img src="https://res.cloudinary.com/dceqpo559/image/upload/v1769602379/faz_logo_cl3wx5.png" alt="FAZ" className="h-6 w-6" />
                              Order Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4 text-sm border-t border-b">
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Buyer Name</p><p className="font-medium">{order.buyerName}</p></div>
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Phone Number</p><p className="font-medium">{order.buyerPhone}</p></div>
                            <div className="col-span-2 space-y-1"><p className="text-xs text-muted-foreground uppercase">Match</p><p className="font-medium">{match ? `${match.homeTeam} vs ${match.awayTeam}` : "-"}</p></div>
                            {/* Detailed Wing Information */}
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Stadium Wing</p><p className="font-bold text-primary">{order.zone}</p></div>
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Tickets</p><p className="font-medium">{order.seats} Seat(s)</p></div>
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Total Paid</p><p className="font-bold">K {order.amount.toLocaleString()}</p></div>
                            <div className="space-y-1"><p className="text-xs text-muted-foreground uppercase">Payment Via</p><Badge variant="outline">{order.paymentMethod}</Badge></div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2">
                            <span>Transaction ID: {order.id}</span>
                            <span>Issued: {format(new Date(order.createdAt), "PPP p")}</span>
                          </div>
                        </DialogContent> 
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No matches found for the current filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}