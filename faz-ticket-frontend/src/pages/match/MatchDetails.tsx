import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Rows as RowsIcon,
  Armchair as SeatIcon,
  Target,
  ShieldCheck,
  Ticket,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types/ticket";

/** =========================================================================
 * MOCK DATA & CONFIG
 * ========================================================================= */
const ALL_MATCHES = [
  {
    id: "1",
    homeTeam: "Zambia",
    awayTeam: "Malawi",
    venue: "Levy Mwanawasa Stadium",
    city: "Ndola",
    date: "Jan 25, 2026",
    time: "15:00 CAT",
    category: "World Cup Qualifier",
  },
];

type SeatStatus = "available" | "sold";
type Seat = { seatNumber: number; status: SeatStatus };
type Row = { rowNumber: number; seats: Seat[] };
type Block = {
  id: string;
  name: string;
  wing: "West Wing" | "East Wing" | "North Wing" | "South Wing" | "VIP Grandstand";
  gate: string;
  price: number;
  rows: Row[];
};

const makeBlock = (id: string, name: string, wing: Block["wing"], gate: string, price: number, rowsCount: number, seatsPerRow: number): Block => ({
  id, name, wing, gate, price,
  rows: Array.from({ length: rowsCount }, (_, r) => ({
    rowNumber: r + 1,
    seats: Array.from({ length: seatsPerRow }, (_, s) => ({
      seatNumber: s + 1,
      status: Math.random() > 0.85 ? "sold" : "available",
    })),
  })),
});

const STADIUM_MAP = {
  blocks: [
    makeBlock("VIP-C", "VIP Central", "VIP Grandstand", "Gate 1", 500, 6, 12),
    makeBlock("WW-L", "West Lower", "West Wing", "Gate 12", 250, 8, 15),
    makeBlock("EW-L", "East Lower", "East Wing", "Gate 6", 200, 10, 20),
    makeBlock("NW-U", "North Upper", "North Wing", "Gate 9", 150, 12, 20),
    makeBlock("SW-U", "South Upper", "South Wing", "Gate 3", 100, 12, 20),
  ],
};

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const activeMatch = useMemo(() => ALL_MATCHES.find((m) => m.id === id) || ALL_MATCHES[0], [id]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedRowNumber, setSelectedRowNumber] = useState<number | null>(null);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);

  useEffect(() => window.scrollTo(0, 0), []);

  const selectedBlock = useMemo(() => STADIUM_MAP.blocks.find((b) => b.id === selectedBlockId) || null, [selectedBlockId]);
  const selectedRow = useMemo(() => selectedBlock?.rows.find((r) => r.rowNumber === selectedRowNumber) || null, [selectedBlock, selectedRowNumber]);

  const totalPrice = selectedBlock?.price && selectedSeatNumbers.length ? selectedBlock.price * selectedSeatNumbers.length : 0;

  const toggleSeat = (seatNumber: number) => {
    setSelectedSeatNumbers((prev) =>
      prev.includes(seatNumber) ? prev.filter((n) => n !== seatNumber) : [...prev, seatNumber].sort((a, b) => a - b)
    );
  };

  const handleAddToCart = () => {
    if (!selectedBlock || !selectedRow || selectedSeatNumbers.length === 0) {
      toast({ variant: "destructive", title: "Incomplete Selection", description: "Please pick your block, row, and seats." });
      return;
    }

    const cartItem: CartItem = {
      matchId: activeMatch.id,
      matchName: `${activeMatch.homeTeam} vs ${activeMatch.awayTeam}`,
      date: `${activeMatch.date} ${activeMatch.time}`,
      stadium: `${activeMatch.venue}, ${activeMatch.city}`,
      zone: selectedBlock.name,
      gate: selectedBlock.gate,
      row: selectedRow.rowNumber.toString(),
      seats: selectedSeatNumbers.map(String),
      price: selectedBlock.price,
      quantity: selectedSeatNumbers.length,
    };

    addToCart(cartItem);
    toast({ title: "Added to Cart", description: `${cartItem.quantity} seats reserved.` });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD] font-sans">
      <Header />
      
      {/* Hero Match Header */}
        <div className="relative rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl h-[400px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A3D1D] via-[#1A3D1D]/70 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover" 
            alt="Chipolopolo Zambia" 
          />
          <div className="relative z-20 p-8 md:p-12 h-full flex flex-col justify-end">
            <Badge className="bg-[#FF9900] text-white border-none mb-4 px-6 py-1 w-fit font-semibold shadow-lg">World Cup Qualifier</Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Zambia <span className="text-[#FF9900]">vs</span> Malawi
            </h1>
            <div className="flex flex-wrap gap-8 text-white/90 font-medium text-sm md:text-base">
              <span className="flex items-center gap-2 drop-shadow"><Calendar className="h-5 w-5 text-[#FF9900]" /> Jan 25, 2026</span>
              <span className="flex items-center gap-2 drop-shadow"><Clock className="h-5 w-5 text-[#FF9900]" /> 15:00 CAT</span>
              <span className="flex items-center gap-2 drop-shadow"><MapPin className="h-5 w-5 text-[#FF9900]" /> Levy Mwanawasa, Ndola</span>
            </div>
          </div>
        </div>

      <main className="flex-1 container mx-auto px-4 -mt-8 pb-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: SEATING MAP */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-2xl overflow-hidden rounded-[3rem] bg-white">
              <CardHeader className="bg-[#1A3D1D] py-6 px-10 border-b border-white/5">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <Target className="h-6 w-6 text-[#FF9900]" /> 
                    <span className="tracking-tight font-semibold">Select Seating Experience</span>
                  </CardTitle>
                </div>
              </CardHeader>
              
                <CardContent className="p-0">
                {/* Wing Selection Strip */}
                <div className="bg-[#F8FAF8] p-6 border-b flex gap-4 overflow-x-auto no-scrollbar">
                  {STADIUM_MAP.blocks.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBlockId(b.id); setSelectedRowNumber(null); setSelectedSeatNumbers([]); }}
                      className={`flex-shrink-0 group relative p-5 rounded-2xl transition-all duration-300 min-w-[140px] text-left ${
                        selectedBlockId === b.id ? "bg-white shadow-xl ring-2 ring-[#FF9900] scale-105" : "bg-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <p className={`font-bold text-sm ${selectedBlockId === b.id ? "text-[#1A3D1D]" : "text-slate-600"}`}>{b.wing}</p>
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">{b.gate}</p>
                      <p className="mt-2 text-[#FF9900] font-bold text-xs">K{b.price}</p>
                    </button>
                  ))}
                </div>

                {selectedBlock ? (
                  <div className="bg-[#112913] p-8 md:p-16 relative overflow-hidden min-h-[700px] flex flex-col">
                    {/* Legend */}
                    <div className="flex flex-wrap justify-between items-center mb-12 gap-4 z-20">
                      <div className="flex gap-6 bg-black/40 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-white" />
                          <span className="text-[10px] font-semibold text-white uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-[#FF9900]" />
                          <span className="text-[10px] font-semibold text-white uppercase">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-white/10" />
                          <span className="text-[10px] font-semibold text-white/30 uppercase">Sold</span>
                        </div>
                      </div>

                      {selectedRow && (
                        <Badge className="bg-[#FF9900] text-white border-none px-4 py-2 font-semibold animate-pulse">
                          {selectedRow.seats.filter(s => s.status === 'available').length} SEATS REMAINING
                        </Badge>
                      )}
                    </div>

                    {/* Perspective Seating Grid */}
                    <div style={{ perspective: '1500px' }} className="flex-1 flex flex-col justify-center">
                      <div style={{ transform: 'rotateX(15deg)' }} className="flex flex-col items-center">
                        
                        {/* Row Selection Circle Buttons */}
                        <div className="flex flex-wrap justify-center gap-4 mb-20">
                          {selectedBlock.rows.map((r) => (
                            <button
                              key={r.rowNumber}
                              onClick={() => { setSelectedRowNumber(r.rowNumber); setSelectedSeatNumbers([]); }}
                              className={`w-14 h-14 rounded-full font-bold text-sm transition-all border-2 flex items-center justify-center ${
                                selectedRowNumber === r.rowNumber 
                                ? "bg-[#FF9900] border-[#FF9900] text-white shadow-[0_0_40px_rgba(255,153,0,0.5)] scale-110" 
                                : "bg-white/5 border-white/10 text-white/40 hover:border-white/40 hover:text-white"
                              }`}
                            >
                              R{r.rowNumber}
                            </button>
                          ))}
                        </div>

                        {/* Interactive Seat Layout */}
                        {selectedRow ? (
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-5 animate-in fade-in zoom-in-95 duration-500">
                            {selectedRow.seats.map((s) => {
                              const isSelected = selectedSeatNumbers.includes(s.seatNumber);
                              const isSold = s.status === "sold";
                              return (
                                <button
                                  key={s.seatNumber}
                                  disabled={isSold}
                                  onClick={() => toggleSeat(s.seatNumber)}
                                  className={`relative w-14 h-16 rounded-t-2xl transition-all border-b-[6px] flex items-center justify-center font-bold text-xs ${
                                    isSold 
                                    ? "bg-white/5 border-white/5 opacity-10 cursor-not-allowed" 
                                    : isSelected 
                                      ? "bg-[#FF9900] border-[#CC7A00] -translate-y-4 shadow-[0_20px_50px_rgba(255,153,0,0.4)] scale-110 text-white" 
                                      : "bg-white border-slate-300 hover:bg-slate-50 text-[#1A3D1D]"
                                  }`}
                                >
                                  {s.seatNumber}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-20 text-center space-y-4">
                             <RowsIcon className="h-16 w-16 text-white/10 mx-auto animate-bounce" />
                             <p className="text-white/40 font-semibold uppercase tracking-[0.2em] text-[10px]">Select a row above to view seats</p>
                          </div>
                        )}
                      </div>
                    </div>

                     {/* The Green Pitch Shimmer */}
                    <div className="mt-20">
                      <div className="h-3 w-full bg-[#39FF14]/20 shadow-[0_0_60px_10px_rgba(57,255,20,0.2)] rounded-full relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </div>
                      <p className="text-center text-[10px] font-bold text-[#39FF14]/40 tracking-[1em] mt-4 uppercase">Pitch Area</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-32 text-center bg-white">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/1200px-Flag_of_Zambia.svg.png" className="w-20 h-12 mx-auto mb-6 opacity-20 object-cover rounded-md" alt="Zambia" />
                    <h3 className="text-2xl font-bold text-[#1A3D1D] uppercase">Select a Wing</h3>
                    <p className="text-slate-400 font-medium">Please choose a wing to start selecting your seats.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white ring-1 ring-[#1A3D1D]/5">
              <CardHeader className="bg-[#1A3D1D] py-8">
                <CardTitle className="text-[#FF9900] text-center uppercase tracking-[0.1em] font-bold text-xl">
                  Ticket Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-10 space-y-10">
                {!selectedBlock ? (
                  <div className="text-center py-20 opacity-20">
                    <SeatIcon className="h-20 w-20 mx-auto mb-4" />
                    <p className="font-semibold uppercase tracking-widest text-xs">Awaiting Selection</p>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-bottom-5 duration-700">
                    <div className="space-y-8">
                      {/* Section Info */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Zone</p>
                          <p className="text-2xl font-bold text-[#1A3D1D] leading-none">{selectedBlock.wing}</p>
                          <Badge className="bg-[#1A3D1D]/5 text-[#1A3D1D] border-none font-bold text-[9px] uppercase">{selectedBlock.name}</Badge>
                        </div>
                        <div className="bg-[#1A3D1D] text-white p-4 rounded-3xl text-center shadow-lg shadow-[#1A3D1D]/20">
                           <p className="text-[8px] font-bold uppercase opacity-60">Entry</p>
                           <p className="text-xl font-bold text-[#FF9900]">{selectedBlock.gate.split(' ')[1]}</p>
                        </div>
                      </div>

                      {/* Row & Seat Selection Pill */}
                      {selectedRow && (
                        <div className="bg-[#F8FAF8] rounded-[2.5rem] p-8 border-2 border-[#1A3D1D]/5">
                          <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Row</p>
                               <p className="text-4xl font-bold text-[#1A3D1D]">{selectedRow.rowNumber}</p>
                             </div>
                             <div className="space-y-1 text-right">
                               <p className="text-[10px] font-bold text-slate-400 uppercase">Seat(s)</p>
                               <p className="text-2xl font-bold text-[#FF9900] break-words">
                                 {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(", ") : "—"}
                               </p>
                             </div>
                          </div>
                        </div>
                      )}

                      <Separator className="bg-slate-100" />

                      {/* Pricing Breakdown */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                          <span>Unit Price</span>
                          <span className="text-slate-900">ZMW {selectedBlock.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase">
                          <span>Quantity</span>
                          <span className="text-slate-900">{selectedSeatNumbers.length} Seats</span>
                        </div>
                        <div className="pt-6 flex justify-between items-end border-t border-dashed border-slate-200">
                           <span className="font-bold text-[#1A3D1D] text-xl uppercase tracking-tighter">Grand Total</span>
                           <div className="text-right">
                             <p className="text-5xl font-bold text-[#1A3D1D] tracking-tighter leading-none">
                               K <span className="text-[#FF9900]">{totalPrice.toFixed(2)}</span>
                             </p>
                           </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="space-y-4 pt-4">
                        <Button 
                          onClick={handleAddToCart}
                          disabled={selectedSeatNumbers.length === 0}
                          className="w-full h-20 rounded-[2rem] bg-[#1A3D1D] hover:bg-[#255229] text-white font-bold uppercase tracking-widest shadow-2xl shadow-[#1A3D1D]/30 transition-all active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 group"
                        >
                          Secure Tickets
                          <ChevronRight className="ml-2 h-6 w-6 text-[#FF9900] group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <ShieldCheck className="h-4 w-4 text-[#FF9900]" /> Encrypted FAZ Checkout
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}