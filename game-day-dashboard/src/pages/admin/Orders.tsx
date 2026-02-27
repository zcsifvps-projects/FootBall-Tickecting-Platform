import { useState } from "react";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const statusColor: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  refunded: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

interface Ticket {
  _id: string;
  matchId: {
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    stadium: string;
    city: string;
  };
  userId: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  customerEmail: string;
  customerPhone: string;
  zone: string;
  quantity: number;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export default function Orders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Fetch all tickets from backend
  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ["allTickets"],
    queryFn: async () => {
      const response = await fetch("http://localhost:5000/api/tickets/admin/all");
      if (!response.ok) throw new Error("Failed to fetch tickets");
      return response.json();
    },
  });

  // Get unique matches from tickets
  const uniqueMatches = Array.from(
    new Map(
      tickets
        .filter((t: Ticket) => t.matchId)
        .map((t: Ticket) => [
          t.matchId._id || `${t.matchId.homeTeam}-${t.matchId.awayTeam}`,
          t.matchId,
        ])
    ).values()
  );

  const [matchFilter, setMatchFilter] = useState("all");

  const filtered = tickets.filter((ticket: Ticket) => {
    const buyerName = ticket.userId
      ? `${ticket.userId.firstName} ${ticket.userId.lastName}`
      : ticket.customerEmail;
    const search_match = `${buyerName} ${ticket._id} ${ticket.customerEmail}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const st = statusFilter === "all" || ticket.status === statusFilter;
    const mf =
      matchFilter === "all" ||
      ticket.matchId._id === matchFilter ||
      `${ticket.matchId.homeTeam}-${ticket.matchId.awayTeam}` === matchFilter;
    const pf = paymentFilter === "all" || ticket.paymentMethod === paymentFilter;
    return search_match && st && mf && pf;
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center py-12">
        Error loading orders: {(error as any).message}
      </div>
    );

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
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={matchFilter} onValueChange={setMatchFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Matches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Matches</SelectItem>
            {uniqueMatches.map((m: any) => (
              <SelectItem key={`${m.homeTeam}-${m.awayTeam}`} value={m._id || `${m.homeTeam}-${m.awayTeam}`}>
                {m.homeTeam} vs {m.awayTeam}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Payment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pay</SelectItem>
            <SelectItem value="mtn">MTN</SelectItem>
            <SelectItem value="airtel">Airtel</SelectItem>
            <SelectItem value="zamtel">Zamtel</SelectItem>
            <SelectItem value="stripe">Stripe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-sidebar-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Buyer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((ticket: Ticket) => {
                const buyerName = ticket.userId
                  ? `${ticket.userId.firstName} ${ticket.userId.lastName}`
                  : "Guest";
                const email = ticket.userId ? ticket.userId.email : ticket.customerEmail;
                return (
                  <TableRow key={ticket._id} className="hover:bg-slate-50/30">
                    <TableCell className="font-mono text-[10px] text-muted-foreground">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{buyerName}</TableCell>
                    <TableCell className="text-xs">{email}</TableCell>
                    <TableCell className="text-xs">{ticket.customerPhone}</TableCell>
                    <TableCell className="text-xs">
                      {ticket.matchId ? `${ticket.matchId.homeTeam} vs ${ticket.matchId.awayTeam}` : "-"}
                    </TableCell>
                    <TableCell className="text-xs font-semibold">{ticket.zone}</TableCell>
                    <TableCell>{ticket.quantity}</TableCell>
                    <TableCell className="font-bold">K {(ticket.totalPrice ?? 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-xs uppercase">
                        {ticket.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusColor[ticket.status] || "bg-gray-100 text-gray-800"} border-none shadow-none text-[10px] uppercase font-bold`}
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {format(new Date(ticket.createdAt), "dd MMM, HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <img
                                src="https://res.cloudinary.com/djuz1gf78/image/upload/v1772100586/fazLogo_kewemd.png"
                                alt="FAZ"
                                className="h-6 w-6"
                              />
                              Order #{ticket._id.slice(-6).toUpperCase()}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 py-4 text-sm border-t border-b">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Buyer</p>
                              <p className="font-medium">{buyerName}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Email</p>
                              <p className="font-medium text-xs">{email}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Phone</p>
                              <p className="font-medium">{ticket.customerPhone}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Match</p>
                              <p className="font-medium">
                                {ticket.matchId
                                  ? `${ticket.matchId.homeTeam} vs ${ticket.matchId.awayTeam}`
                                  : "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Zone</p>
                              <p className="font-bold text-primary">{ticket.zone}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Quantity</p>
                              <p className="font-medium">{ticket.quantity} Seat(s)</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Total Paid</p>
                              <p className="font-bold">K {(ticket.totalPrice ?? 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Payment</p>
                              <Badge variant="outline">{ticket.paymentMethod}</Badge>
                            </div>
                            <div className="col-span-2 space-y-1">
                              <p className="text-xs text-muted-foreground uppercase">Status</p>
                              <Badge
                                className={`${
                                  statusColor[ticket.status] || "bg-gray-100 text-gray-800"
                                } border-none`}
                              >
                                {ticket.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2">
                            <span>ID: {ticket._id}</span>
                            <span>
                              {format(
                                new Date(ticket.createdAt),
                                "PPP p"
                              )}
                            </span>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                    No orders found for the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
