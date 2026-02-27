import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Ticket, TrendingUp, Users } from "lucide-react";

interface TicketStats {
  totalTicketsSold: number;
  totalRevenue: number;
  pendingTickets: number;
  cancelledTickets: number;
  tickets: any[];
}

export default function Analytics() {
  // Fetch all matches with ticket statistics
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["adminMatches"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5000/api/matches/admin/matches");
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
    },
  });

  // Fetch ticket statistics for each match
  const { data: ticketStats = [] } = useQuery({
    queryKey: ["ticketStats", matches],
    queryFn: async () => {
      if (!matches.length) return [];
      const stats = await Promise.all(
        matches.map(async (match: any) => {
          const res = await fetch(`http://localhost:5000/api/tickets/${match._id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            matchId: match._id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            ...data,
          };
        })
      );
      return stats.filter(Boolean);
    },
    enabled: matches.length > 0,
  });

  // Calculate totals
  const totalRevenue = ticketStats.reduce((sum, s: TicketStats) => sum + s.totalRevenue, 0);
  const totalTickets = ticketStats.reduce((sum, s: TicketStats) => sum + s.totalTicketsSold, 0);
  const pendingTickets = ticketStats.reduce((sum, s: TicketStats) => sum + s.pendingTickets, 0);

  // Chart data - Tickets sold per match
  const chartData = ticketStats.map((s: TicketStats) => ({
    name: `${s.homeTeam} vs ${s.awayTeam}`.slice(0, 20),
    tickets: s.totalTicketsSold,
    revenue: s.totalRevenue / 1000, // in thousands
  }));

  // Revenue by payment method
  const paymentMethodData = ticketStats.flatMap((s: TicketStats) =>
    s.tickets.map((t: any) => t.paymentMethod)
  );
  const paymentStats = [
    { name: "Stripe", value: paymentMethodData.filter((p: any) => p === "stripe").length },
    { name: "MTN Money", value: paymentMethodData.filter((p: any) => p === "mtn_mobile_money").length },
    { name: "PayPal", value: paymentMethodData.filter((p: any) => p === "paypal").length },
    { name: "Zamtel", value: paymentMethodData.filter((p: any) => p === "zamtel").length },
  ].filter((p) => p.value > 0);

  const COLORS = ["#f97316", "#06b6d4", "#8b5cf6", "#ec4899"];

  if (isLoading) return <div className="p-6 text-center">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">K{totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
            <Ticket className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">Completed purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTickets}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
            <p className="text-xs text-muted-foreground">Active listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Sold per Match */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Sold by Match</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tickets" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Match */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Match (K, in thousands)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        {paymentStats.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Match Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Match Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ticketStats.map((stat: TicketStats) => (
                <div key={stat.matchId} className="p-3 border rounded-lg hover:bg-slate-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">
                      {stat.homeTeam} vs {stat.awayTeam}
                    </h4>
                    <span className="text-sm font-bold text-orange-600">
                      K{stat.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
                    <div>Sold: {stat.totalTicketsSold}</div>
                    <div>Pending: {stat.pendingTickets}</div>
                    <div>Cancelled: {stat.cancelledTickets}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
