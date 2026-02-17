import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Eye, MapPin, Calendar, Users, Zap, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { MatchStatus } from "@/data/types";
import { cn } from "@/lib/utils";

/** * OFFICIAL ZAMBIAN STADIUM CAPACITIES
 */
const STADIUM_CAPACITIES: Record<string, number> = {
  "Heroes Stadium": 60000,
  "Woodlands Stadium": 10000,
  "Arthur Davies Stadium": 15000,
  "Nkana Stadium": 10000,
  "Nkoloma Stadium": 5000,
  "Levy Mwanawasa Stadium": 49800, // Added for completeness
};

const statusColor: Record<MatchStatus, string> = {
  upcoming: "bg-blue-500/10 text-blue-600 border-blue-200",
  live: "bg-emerald-500/10 text-emerald-600 border-emerald-200 animate-pulse",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-rose-500/10 text-rose-600 border-rose-200",
};

export default function Matches() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["adminMatches"],
    queryFn: () => adminApi.matches.getAll(),
  });

  const filtered = (matches || []).filter((m: any) => {
    const matchesSearch = `${m.homeTeam} ${m.awayTeam} ${m.stadium || m.venue || ''}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter || m.competition === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-8 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic text-[#0e633d]">
            Fixtures <span className="text-[#ef7d00]">& Events</span>
          </h2>
          <p className="text-slate-500 font-medium italic tracking-tight">Real-time inventory management for Zambia's elite venues.</p>
        </div>
        <Button asChild className="bg-[#0e633d] hover:bg-[#0a4d2f] text-white rounded-xl px-6 shadow-lg shadow-emerald-900/20 group">
          <Link to="/admin/matches/create">
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            <span className="font-bold uppercase tracking-widest text-xs">Register Match</span>
          </Link>
        </Button>
      </div>

      {/* Sporty Filters */}
      <Card className="border-none shadow-sm bg-slate-100/50 p-4 rounded-2xl">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search teams, city or stadium..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-10 bg-white border-none shadow-inner rounded-xl h-11 focus-visible:ring-[#0e633d]" 
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px] h-11 bg-white border-none rounded-xl font-bold text-xs uppercase tracking-tighter shadow-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all">ALL STATUS</SelectItem>
              <SelectItem value="upcoming">UPCOMING</SelectItem>
              <SelectItem value="live">LIVE</SelectItem>
              <SelectItem value="completed">COMPLETED</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] h-11 bg-white border-none rounded-xl font-bold text-xs uppercase tracking-tighter shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              <SelectItem value="all">ALL CATEGORIES</SelectItem>
              <SelectItem value="National">NATIONAL TEAM</SelectItem>
              <SelectItem value="League">SUPER LEAGUE</SelectItem>
              <SelectItem value="World Cup Qualifier">WORLD CUP Q</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* High-Performance Table */}
      <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px] py-6 pl-8">Fixture</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Type</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Venue</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px]">Ticket Load / Capacity</TableHead>
                <TableHead className="text-white font-black uppercase tracking-widest text-[10px] text-right pr-8">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((match) => {
                // Get official capacity or fallback to zone sum
                const officialCapacity = STADIUM_CAPACITIES[match.venue] || match.zones.reduce((s, z) => s + z.totalSeats, 0);
                const soldSeats = match.zones.reduce((s, z) => s + z.soldSeats, 0);
                const pct = Math.round((soldSeats / officialCapacity) * 100);
                
                return (
                  <TableRow key={match.id} className="group border-b-slate-50">
                    <TableCell className="py-6 pl-8">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-800 uppercase italic leading-none">
                          {match.homeTeam} <span className="text-[#ef7d00] font-medium not-italic px-0.5">VS</span> {match.awayTeam}
                        </span>
                        <div className="flex gap-2 mt-2">
                           <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest", statusColor[match.status])}>
                             {match.status}
                           </Badge>
                           <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                             <Calendar className="h-3 w-3" /> {match.date}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-slate-100 text-slate-600 border-none text-[9px] font-black italic">
                        {match.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs">
                          <MapPin className="h-3.5 w-3.5 text-[#ef7d00] shrink-0" />
                          <span className="truncate max-w-[140px]">{match.venue}</span>
                        </div>
                        {officialCapacity >= 30000 && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-amber-600">
                            <ShieldAlert className="h-3 w-3" /> High Capacity Venue
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[180px]">
                        <div className="flex justify-between items-end">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                             Inventory Progress
                           </span>
                           <span className={cn(
                             "text-[10px] font-black italic",
                             pct > 80 ? "text-rose-600" : "text-[#0e633d]"
                           )}>
                             {pct}% {pct > 90 ? 'SOLD OUT' : 'BOOKED'}
                           </span>
                        </div>
                        <Progress value={pct} className="h-2 bg-slate-100 [&>div]:bg-[#0e633d]" />
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-500">
                          <div className="flex items-center gap-1 italic uppercase">
                            <Users className="h-3 w-3" /> {soldSeats.toLocaleString()} Issued
                          </div>
                          <div className="text-slate-400 uppercase tracking-widest">
                            Max {officialCapacity.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 hover:border-[#0e633d] hover:text-[#0e633d] hover:bg-emerald-50 transition-all">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
                          {/* Header of Dialog */}
                          <div className="bg-[#0e633d] p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                              <Users size={120} strokeWidth={3} />
                            </div>
                            <DialogHeader>
                              <p className="text-[#ef7d00] text-xs font-black uppercase tracking-[0.3em] mb-2">{match.venue}</p>
                              <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter leading-tight">
                                {match.homeTeam} <br /> 
                                <span className="text-[#ef7d00]">vs</span> {match.awayTeam}
                              </DialogTitle>
                            </DialogHeader>
                          </div>
                          
                          <div className="p-8 space-y-8 bg-white">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Capacity</p>
                                <p className="text-xl font-black text-slate-900">{officialCapacity.toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Seats Sold</p>
                                <p className="text-xl font-black text-[#0e633d]">{soldSeats.toLocaleString()}</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Remaining</p>
                                <p className="text-xl font-black text-[#ef7d00]">{(officialCapacity - soldSeats).toLocaleString()}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-black uppercase tracking-widest text-xs text-slate-500 mb-4 flex items-center gap-2">
                                <Zap className="h-4 w-4 text-[#ef7d00]" /> Revenue Breakdown by Zone
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {match.zones.map((z) => (
                                  <div key={z.id} className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#0e633d] transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="text-[10px] font-black text-[#0e633d] uppercase italic leading-none mb-1">{z.name}</p>
                                        <p className="text-[9px] font-bold text-slate-400">{z.gate}</p>
                                      </div>
                                      <p className="text-sm font-black text-slate-800">K{z.price}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Progress value={(z.soldSeats / z.totalSeats) * 100} className="h-1.5 flex-1" />
                                      <span className="text-[9px] font-bold text-slate-500 whitespace-nowrap">{Math.round((z.soldSeats / z.totalSeats) * 100)}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                               <Button className="flex-1 bg-slate-900 text-white rounded-xl h-12 font-bold uppercase tracking-widest text-xs shadow-lg hover:shadow-xl transition-all">Edit Match Details</Button>
                               <Button variant="outline" className="flex-1 border-slate-200 rounded-xl h-12 font-bold uppercase tracking-widest text-xs hover:bg-slate-50">Generate Audit Report</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}