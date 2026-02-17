import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Trophy, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap,
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import { teams } from "@/data/mockData";
import type { MatchCategory } from "@/data/types";

interface WingInput {
  name: string;
  gate: string;
  price: string;
  totalSeats: string;
}

const categories: MatchCategory[] = ["National", "League", "Cup", "Friendly", "World Cup Qualifier"];

const stadiumOptions = [
  { name: "Heroes Stadium", capacity: "60,000" },
  { name: "Levy Mwanawasa Stadium", capacity: "49,800" },
  { name: "Nkana Stadium", capacity: "10,000" },
  { name: "Nkoloma Stadium", capacity: "5,000" },
  { name: "Woodlands Stadium", capacity: "10,000" },
  { name: "Arthur Davies Stadium", capacity: "15,000" },
];

export default function CreateMatch() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saleEndTime, setSaleEndTime] = useState("15:00");

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [maxTickets, setMaxTickets] = useState("4");
  const [isFeatured, setIsFeatured] = useState(false);
  const [badge, setBadge] = useState("");

  const [wings, setWings] = useState<WingInput[]>([
    { name: "VIP Grandstand", gate: "Gate 1", price: "500", totalSeats: "0" },
    { name: "West Wing", gate: "Gate 12", price: "250", totalSeats: "0" },
    { name: "East Wing", gate: "Gate 6", price: "200", totalSeats: "0" },
    { name: "North Wing", gate: "Gate 9", price: "150", totalSeats: "0" },
    { name: "South Wing", gate: "Gate 3", price: "100", totalSeats: "0" },
  ]);

  useEffect(() => {
    if (venue) {
      const selectedStadium = stadiumOptions.find((s) => s.name === venue);
      if (selectedStadium) {
        const totalCapacity = parseInt(selectedStadium.capacity.replace(/,/g, ""), 10);
        const seatPerWing = Math.floor(totalCapacity / wings.length);
        
        const updatedWings = wings.map((wing, index) => {
          if (index === wings.length - 1) {
            const sumOfOthers = seatPerWing * (wings.length - 1);
            return { ...wing, totalSeats: (totalCapacity - sumOfOthers).toString() };
          }
          return { ...wing, totalSeats: seatPerWing.toString() };
        });
        setWings(updatedWings);
      }
    }
  }, [venue, wings.length]);

  const addWing = () => setWings([...wings, { name: "", gate: "", price: "", totalSeats: "0" }]);
  const removeWing = (i: number) => setWings(wings.filter((_, idx) => idx !== i));
  const updateWing = (i: number, field: keyof WingInput, value: string) => {
    const updated = [...wings];
    updated[i] = { ...updated[i], [field]: value };
    setWings(updated);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newMatch: any) => adminApi.matches.create(newMatch),
    onSuccess(data) {
      toast({ title: "Match Created", description: `${data.homeTeam} vs ${data.awayTeam} successfully published.` });
      queryClient.invalidateQueries({ queryKey: ["adminMatches"] });
      navigate("/admin/matches");
    },
    onError(err: any) {
      toast({ variant: "destructive", title: "Create Failed", description: err?.message || "Could not create match" });
    }
  });

  const { mutate } = mutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedStadium = stadiumOptions.find((s) => s.name === venue);
    if (selectedStadium) {
      const totalCapacity = parseInt(selectedStadium.capacity.replace(/,/g, ""), 10);
      const currentTotal = wings.reduce((sum, w) => sum + parseInt(w.totalSeats || "0", 10), 0);
      if (currentTotal !== totalCapacity) {
        toast({
          variant: "destructive",
          title: "Capacity Mismatch",
          description: `Total wing seats (${currentTotal.toLocaleString()}) must match ${venue} capacity (${selectedStadium.capacity}).`,
        });
        return;
      }
    }

    const payload = {
      homeTeam,
      awayTeam,
      competition: category,
      date,
      time,
      stadium: venue,
      city: venue || "",
      priceFrom: Math.max(...wings.map((w) => Number(w.price) || 0)),
      totalTickets: wings.reduce((s, w) => s + (Number(w.totalSeats) || 0), 0),
      description: badge || "",
      imageUrl: "",
      zones: wings.map((w) => ({ name: w.name, gate: w.gate, price: Number(w.price) || 0, totalSeats: Number(w.totalSeats) || 0 })),
    };

    mutate(payload);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-['Inter']">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border-slate-200 hover:bg-slate-50 transition-all h-12 w-12"
            onClick={() => navigate("/admin/matches")}
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Button>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
              Create <span className="text-[#0e633d]">FAZ</span> Match
            </h2>
            <p className="text-base text-slate-500 font-medium italic">Configure matchday logistics and ticketing</p>
          </div>
        </div>
        
        <div className="bg-[#0e633d] text-white px-6 py-4 rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center gap-4 border-b-4 border-[#ef7d00]">
          <Trophy className="h-7 w-7 text-[#ef7d00]" />
          <div className="leading-tight">
            <p className="text-xs font-black uppercase tracking-widest opacity-80">Fixture Preview</p>
            <p className="text-lg font-bold truncate max-w-[200px]">
              {homeTeam || "Home"} vs {awayTeam || "Away"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          
          <Card className="border-none shadow-sm bg-slate-50/50 rounded-3xl overflow-hidden">
            <div className="h-2 bg-[#0e633d] w-full" />
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#0e633d]" /> Teams & Category
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 pt-4">
              
              {/* Home Team Input + Suggestion Select */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase text-slate-600 ml-1">Home Team</Label>
                <div className="relative group">
                  <Input 
                    placeholder="Type team name..." 
                    value={homeTeam} 
                    onChange={(e) => setHomeTeam(e.target.value)}
                    className="h-14 rounded-xl border-slate-200 bg-white font-bold text-base pr-12 focus:ring-[#0e633d]"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select onValueChange={setHomeTeam}>
                      <SelectTrigger className="w-8 h-8 border-none bg-slate-100 hover:bg-slate-200 p-0 focus:ring-0 rounded-lg">
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(t => (
                          <SelectItem key={t} value={t} className="text-base font-semibold">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Away Team Input + Suggestion Select */}
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase text-slate-600 ml-1">Away Team</Label>
                <div className="relative group">
                  <Input 
                    placeholder="Type team name..." 
                    value={awayTeam} 
                    onChange={(e) => setAwayTeam(e.target.value)}
                    className="h-14 rounded-xl border-slate-200 bg-white font-bold text-base pr-12 focus:ring-[#0e633d]"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <Select onValueChange={setAwayTeam}>
                      <SelectTrigger className="w-8 h-8 border-none bg-slate-100 hover:bg-slate-200 p-0 focus:ring-0 rounded-lg">
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(t => (
                          <SelectItem key={t} value={t} className="text-base font-semibold">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm font-bold uppercase text-slate-600 ml-1">Match Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c} className="text-base font-semibold">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-black uppercase tracking-[0.2em] text-[#ef7d00] flex items-center gap-2">
                <Zap className="h-5 w-5" /> Stadium Wings
              </CardTitle>
              <Button 
                type="button" 
                onClick={addWing} 
                className="bg-[#0e633d] hover:bg-emerald-700 text-white rounded-xl h-11 px-6 text-sm font-bold uppercase italic tracking-normal"
              >
                <Plus className="mr-1 h-4 w-4" /> Add Wing
              </Button>
            </div>
            <CardContent className="space-y-6 p-6">
              {wings.map((w, i) => (
                <div key={i} className="group relative grid gap-5 sm:grid-cols-6 items-end border border-slate-100 rounded-[1.5rem] p-6 bg-white hover:border-[#0e633d]/30 transition-all shadow-sm">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-xs font-black text-slate-500 uppercase">Wing Name</Label>
                    <Input value={w.name} onChange={(e) => updateWing(i, "name", e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-base focus:ring-[#0e633d]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase">Gate</Label>
                    <Input value={w.gate} onChange={(e) => updateWing(i, "gate", e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase">Price (K)</Label>
                    <Input type="number" value={w.price} onChange={(e) => updateWing(i, "price", e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-base text-[#0e633d]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-slate-500 uppercase">Total Seats</Label>
                    <Input type="number" value={w.totalSeats} onChange={(e) => updateWing(i, "totalSeats", e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-base" />
                  </div>
                  <div className="flex justify-center pb-1">
                    {wings.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeWing(i)} className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full h-11 w-11">
                        <Trash2 className="h-6 w-6" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-right pr-6 pt-2">
                <p className="text-sm font-bold text-slate-500 uppercase italic">
                  Total Allocated: <span className="text-[#0e633d]">{wings.reduce((sum, w) => sum + parseInt(w.totalSeats || "0", 10), 0).toLocaleString()}</span> / {venue ? stadiumOptions.find(s => s.name === venue)?.capacity : "0"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-md rounded-3xl bg-white p-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#ef7d00]" /> Schedule & Venue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Match Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-sm" />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-600 uppercase">Kick-off</Label>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-xl border-slate-100 bg-slate-50 font-bold text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase italic flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Select Stadium
                </Label>
                <Select value={venue} onValueChange={setVenue}>
                  <SelectTrigger className="h-14 rounded-xl border-slate-100 bg-slate-50 font-black text-base">
                    <SelectValue placeholder="Select Venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {stadiumOptions.map(s => (
                      <SelectItem key={s.name} value={s.name} className="text-base font-semibold">
                        {s.name} <span className="text-xs font-normal opacity-60">({s.capacity})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md rounded-3xl bg-white p-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#ef7d00]" /> Ticket Window
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-600 uppercase tracking-tight">Sale Start Date</Label>
                <Input type="date" value={saleStart} onChange={(e) => setSaleStart(e.target.value)} className="rounded-xl border-slate-100 bg-slate-50 font-bold h-12 text-sm" />
              </div>
              <div className="space-y-2 pt-1 border-t border-slate-50 mt-2">
                <Label className="text-xs font-black text-[#0e633d] uppercase tracking-tight">Sale Deadline (End)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="date" value={saleEnd} onChange={(e) => setSaleEnd(e.target.value)} className="rounded-xl border-slate-100 bg-slate-50 font-bold h-12 text-sm" />
                  <Input type="time" value={saleEndTime} onChange={(e) => setSaleEndTime(e.target.value)} className="rounded-xl border-slate-100 bg-slate-50 font-bold h-12 text-sm" />
                </div>
                <p className="text-xs text-slate-400 italic font-medium">Sales will automatically close at this time</p>
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                  <div className="space-y-1">
                    <Label className="text-sm font-black text-slate-800">Featured Match</Label>
                    <p className="text-xs text-slate-500 leading-none font-medium italic">Push to home page</p>
                  </div>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} className="scale-110" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 pt-4">
            <Button type="submit" className="w-full h-16 bg-[#0e633d] hover:bg-emerald-800 text-white rounded-2xl shadow-xl shadow-emerald-900/30 transition-all active:scale-[0.98] font-black italic uppercase tracking-widest text-xl">
              Publish FAZ Match
            </Button>
            <Button type="button" variant="ghost" className="w-full h-12 text-slate-500 font-black uppercase text-sm tracking-widest hover:bg-slate-50 rounded-xl" onClick={() => navigate("/admin/matches")}>
              Cancel Draft
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}