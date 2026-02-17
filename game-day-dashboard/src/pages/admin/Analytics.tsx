import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stats, dailySales, matches, orders } from "@/data/mockData";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, 
  Ticket, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  Activity,
  Award
} from "lucide-react";

// Official FAZ Palette
const COLORS = [
  "#1E3A8A", // North Wing - Deep Blue
  "#DC2626", // South Wing - Red
  "#059669", // East Wing - Emerald
  "#F59E0B", // West Wing - Amber
  "#7C3AED", // VIP / Other - Purple
];

export default function Analytics() {
  const [startDate, setStartDate] = useState("2026-01-11");
  const [endDate, setEndDate] = useState("2026-02-09");

  const filteredSales = dailySales.filter((d) => d.date >= startDate && d.date <= endDate);
  const totalRevInRange = filteredSales.reduce((s, d) => s + d.revenue, 0);
  const totalTicketsInRange = filteredSales.reduce((s, d) => s + d.tickets, 0);

  const matchComparison = matches.map((m) => {
    const matchOrders = orders.filter((o) => o.matchId === m.id && o.status === "confirmed");
    return {
      name: `${m.homeTeam.split(" ")[0]} vs ${m.awayTeam.split(" ")[0]}`,
      revenue: matchOrders.reduce((s, o) => s + o.amount, 0),
      tickets: matchOrders.reduce((s, o) => s + o.seats, 0),
    };
  }).sort((a, b) => b.revenue - a.revenue);

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