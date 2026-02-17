import { DollarSign, Ticket, Trophy, ShoppingCart, TrendingUp, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/admin/StatCard";
import { stats, orders, matches, dailySales } from "@/data/mockData";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

// Sporty Zambian Palette
const COLORS = ["#0e633d", "#ef7d00", "#FFCC00", "#000000", "#FFFFFF"];

const statusColor: Record<string, string> = {
  confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  refunded: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  cancelled: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export default function Dashboard() {
  const recentOrders = orders.slice(0, 8);

  return (
    <div className="space-y-8 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-[#0e633d]">
            Match-Day <span className="text-[#ef7d00]">Command Center</span>
          </h2>
          <p className="text-slate-500 font-medium">Real-time ticketing analytics & stadium overview.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0e633d] text-white px-4 py-2 rounded-xl shadow-lg shadow-emerald-900/20">
          <Activity className="h-4 w-4 animate-pulse text-[#ef7d00]" />
          <span className="text-xs font-bold uppercase tracking-widest">System Live: 2026 Season</span>
        </div>
      </div>

      {/* Sporty Stat Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative overflow-hidden group">
          <StatCard 
            title="Total Revenue" 
            value={`ZMW ${stats.totalRevenue.toLocaleString()}`} 
            subtitle="+12% VS LAST MATCH" 
            icon={DollarSign} 
            className="border-none bg-gradient-to-br from-[#0e633d] to-[#063b24] text-white shadow-xl"
          />
          <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
        </div>
        
        <StatCard title="Tickets Sold" value={stats.totalTickets.toLocaleString()} subtitle="92% SEATING CAPACITY" icon={Ticket} className="border-l-4 border-l-[#ef7d00] shadow-md" />
        <StatCard title="Active Matches" value={stats.activeMatches} subtitle="3 LIVE NOW" icon={Trophy} className="border-l-4 border-l-[#FFCC00] shadow-md" />
        <StatCard title="Total Orders" value={stats.totalOrders} subtitle="ACROSS ALL CHANNELS" icon={ShoppingCart} className="border-l-4 border-l-black shadow-md" />
      </div>

      {/* Main Charts Area */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Area Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Revenue Velocity</CardTitle>
              <Badge className="bg-[#0e633d] text-white">Live Stream</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailySales}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e633d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0e633d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  formatter={(v: number) => [`ZMW ${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0e633d" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales by Zone - Donut Style */}
        <Card className="border-none shadow-xl rounded-3xl bg-white">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Stadium Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.revenueByZone} 
                  dataKey="revenue" 
                  nameKey="zone" 
                  innerRadius={60} 
                  outerRadius={85} 
                  paddingAngle={5}
                >
                  {stats.revenueByZone.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-3 mt-2">
               {stats.revenueByZone.slice(0, 3).map((z, i) => (
                 <div key={i} className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                   <span className="text-[10px] font-bold uppercase text-slate-500">{z.zone}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Bar Chart & Table */}
      <div className="grid gap-6 lg:grid-cols-2">
         {/* Daily Tickets */}
         <Card className="border-none shadow-lg rounded-3xl bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-600">Sales Intensity</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="tickets" fill="#ef7d00" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Orders - Styled like a scoreboard */}
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 text-white flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black uppercase tracking-widest italic">Live Order Feed</CardTitle>
            <Users className="h-4 w-4 text-[#ef7d00]" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase">Buyer</TableHead>
                  <TableHead className="text-[10px] font-black uppercase">Match</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-right">Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => {
                  const match = matches.find(m => m.id === order.matchId);
                  return (
                    <TableRow key={order.id} className="hover:bg-slate-50/80 transition-colors border-b-slate-100">
                      <TableCell className="font-bold text-slate-700">{order.buyerName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-[#0e633d] uppercase tracking-tighter truncate w-32">
                            {match ? `${match.homeTeam} vs ${match.awayTeam}` : 'World Cup Qualifier'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{order.zone}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-slate-600">
                        {order.amount}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={`text-[9px] font-black uppercase ${statusColor[order.status]}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}