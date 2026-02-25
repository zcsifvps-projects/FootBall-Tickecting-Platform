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
      const res = await fetch("http://localhost:5000/api/admin/matches");
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

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16 font-['Times_New_Roman',serif]">
      
      {/* Header & Date Picker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-slate-100 pb-8">
        <div>
          <h2 className="text-5xl font-bold tracking-tight text-slate-900 uppercase">
            Sales <span className="text-[#0e633d]">Analytics</span>
          </h2>
          <p className="text-xl text-slate-500 italic mt-2 flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#ef7d00]" /> 
            Real-time Ticketing Intelligence & Performance
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> From
            </Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 w-[170px] font-bold border-none bg-slate-50 rounded-lg" />
          </div>
          <div className="h-10 w-px bg-slate-200 mt-4" />
          <div className="space-y-1">
            <Label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> To
            </Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 w-[170px] font-bold border-none bg-slate-50 rounded-lg" />
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="border-none shadow-xl bg-gradient-to-br from-[#0e633d] to-emerald-900 text-white rounded-[2rem] overflow-hidden relative group">
          <DollarSign className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10 group-hover:scale-110 transition-transform" />
          <CardContent className="pt-10 pb-8 px-8">
            <div className="text-lg font-bold uppercase tracking-widest text-emerald-200 italic">Total Revenue</div>
            <div className="text-4xl font-black mt-2 tracking-tighter">ZMW {totalRevInRange.toLocaleString()}</div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                <TrendingUp className="h-4 w-4" /> +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden border-b-8 border-[#ef7d00]">
          <CardContent className="pt-10 pb-8 px-8">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-lg font-bold uppercase tracking-widest text-slate-400 italic">Tickets Issued</div>
                    <div className="text-4xl font-black mt-2 tracking-tighter text-slate-900">{totalTicketsInRange.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl">
                    <Ticket className="h-8 w-8 text-[#ef7d00]" />
                </div>
            </div>
            <p className="text-slate-400 text-sm mt-4 font-bold">Across all match categories</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden border-b-8 border-slate-900">
          <CardContent className="pt-10 pb-8 px-8">
            <div className="text-lg font-bold uppercase tracking-widest text-slate-400 italic">Daily Average</div>
            <div className="text-4xl font-black mt-2 tracking-tighter text-slate-900">
                ZMW {filteredSales.length ? Math.round(totalRevInRange / filteredSales.length).toLocaleString() : 0}
            </div>
            <p className="text-slate-400 text-sm mt-4 font-bold italic underline decoration-[#ef7d00] underline-offset-4">Based on {filteredSales.length} active days</p>
          </CardContent>
        </Card>
      </div>

      {/* Primary Chart: Revenue Trend */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white p-6">
        <CardHeader className="px-6">
          <CardTitle className="text-2xl font-bold uppercase text-slate-800 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-[#0e633d]" /> Revenue Performance Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredSales} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 'bold' }} tickFormatter={(v) => v.slice(5)} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 'bold' }} tickFormatter={(v) => `K${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                formatter={(v: number) => [`ZMW ${v.toLocaleString()}`, "Revenue"]} 
              />
              <Line type="monotone" dataKey="revenue" stroke="#0e633d" strokeWidth={4} dot={{ r: 6, fill: "#ef7d00", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Match Ranking Table Style */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 py-6 px-10">
            <CardTitle className="text-xl font-bold uppercase tracking-widest text-[#ef7d00] flex items-center gap-3">
              <Award className="h-6 w-6" /> Top Selling Matches
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-6">
              {matchComparison.slice(0, 5).map((m, i) => (
                <div key={m.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-lg ${i === 0 ? 'bg-[#ef7d00] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-800 group-hover:text-[#0e633d] transition-colors cursor-default">{m.name}</span>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{m.tickets.toLocaleString()} Tickets Sold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#0e633d]">K {m.revenue.toLocaleString()}</div>
                    <Badge variant="outline" className="text-[10px] font-black uppercase border-slate-200">Confirmed Sales</Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-8 border-2 border-dashed border-slate-200 h-14 rounded-2xl font-bold italic text-slate-500 hover:text-[#0e633d] hover:bg-emerald-50">
                View All Match Rankings <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Zone Breakdown Pie */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
          <CardHeader className="pt-10 px-10 pb-0">
            <CardTitle className="text-2xl font-bold uppercase text-slate-800">Revenue by Zone</CardTitle>
            <p className="text-slate-400 font-bold italic">Stadium Distribution</p>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                    data={stats.revenueByZone} 
                    dataKey="revenue" 
                    nameKey="zone" 
                    cx="50%" cy="50%" 
                    innerRadius={80}
                    outerRadius={120} 
                    paddingAngle={5}
                >

                 {/* Ensuring unique color mapping for all 5 zones */}
                  {stats.revenueByZone.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                   </Pie>
                <Tooltip />
                <Legend 
                iconType="circle" 
                layout="vertical" 
                verticalAlign="middle" 
                align="right" 
                wrapperStyle={{ fontWeight: 'bold', fontSize: '14px' , paddingLeft: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}