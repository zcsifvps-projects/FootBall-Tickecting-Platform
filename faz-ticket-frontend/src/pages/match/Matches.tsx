// src/pages/match/Matches.tsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Search, Grid2X2, List } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function Matches() {
  const { data: matches = [], isLoading: loading, error } = useQuery({
    queryKey: ["matches"],
    queryFn: () => api.matches.getAll(),
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        
        <h1 className="text-4xl font-black italic uppercase mb-8">
          Match <span className="text-[#0e633d]">Center</span>
        </h1>

        {loading && <p className="text-center text-slate-500">Loading matches...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        <div className="space-y-6">
          {matches.map((match) => (
            <div key={match._id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                
                {/* MATCHUP: FLAGS ABOVE NAMES */}
                <div className="flex items-center gap-8 md:gap-16">
                  
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-24 rounded-lg overflow-hidden border shadow-sm bg-slate-100">
                      <img 

                        alt={match.homeTeam}
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                    <span className="font-black italic uppercase tracking-tighter">{match.homeTeam}</span>
                  </div>

                  <span className="text-2xl font-black text-slate-200 italic">VS</span>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-16 w-24 rounded-lg overflow-hidden border shadow-sm bg-slate-100">
                      <img 
                        alt={match.awayTeam}
                        className="w-full h-full object-cover"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                    <span className="font-black italic uppercase tracking-tighter">{match.awayTeam}</span>
                  </div>
                </div>

                {/* INFO */}
                <div className="flex-1 border-l border-slate-100 pl-8 hidden md:block">
                  <p className="text-[10px] font-black uppercase text-[#0e633d] tracking-widest mb-2">{match.competition}</p>
                  <div className="flex items-center gap-2 text-slate-500 font-bold mb-1">
                    <Calendar className="h-4 w-4" /> {match.date}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="h-4 w-4" /> {match.stadium || match.city}
                  </div>
                </div>

                {/* PRICE & BUTTON */}
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center md:text-right">Tickets from</p>
                    <p className="text-3xl font-black text-[#0e633d] italic leading-none">ZMW {match.priceFrom}</p>
                  </div>
                  
                  <Button 
                    asChild 
                    className={`h-12 px-10 rounded-2xl font-black uppercase italic transition-all ${
                      match.status === "sold-out" ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-[#0e633d] text-white"
                    }`}
                  >
                    {match.status === "sold-out" ? <span>Sold Out</span> : <Link to={`/match/${match._id}`}>Buy Now</Link>}
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}