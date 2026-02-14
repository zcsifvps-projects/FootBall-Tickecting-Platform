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
    makeBlock("WW-L", "West Wing", "West Wing", "Gate 12", 250, 8, 15),
    makeBlock("EW-L", "East Wing", "East Wing", "Gate 6", 200, 10, 20),
    makeBlock("NW-U", "North Wing", "North Wing", "Gate 9", 150, 12, 20),
    makeBlock("SW-U", "South Wing", "South Wing", "Gate 3", 100, 12, 20),
  ],
};

export default function MatchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const activeMatch = useMemo(() => ALL_MATCHES.find((m) => m.id === id) || ALL_MATCHES[0], [id]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedRowNumber, setSelectedRowNumber] = useState<number | null>(null);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<number[]>([]);

    /** * PERSISTENCE EFFECT
   * Runs on mount and whenever the cart changes. 
   * If the user has already selected tickets for this match, we restore the UI state.
   */
  useEffect(() => {
    window.scrollTo(0, 0);

    const existingItem = cart.find((item) => item.matchId === activeMatch.id);

    if (existingItem) {
      // 1. Find the block by its name (e.g., "West Wing")
      const block = STADIUM_MAP.blocks.find((b) => b.name === existingItem.zone);
      if (block) {
        setSelectedBlockId(block.id);
        // 2. Set the row
        setSelectedRowNumber(parseInt(existingItem.row));
        // 3. Set the seats
        setSelectedSeatNumbers(existingItem.seats.map(Number));
      }
    }
  }, [activeMatch.id]); // Only run once on mount for this specific match

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
          {/* Green overlay removed for maximum image visibility */}
            <img 
                src="https://res.cloudinary.com/dceqpo559/image/upload/v1770295140/fb_image_a6tiqe.jpg" 
                className="absolute inset-0 w-full h-full object-cover" 
                  alt="Chipolopolo Zambia" 
                    />
  
                <div className="relative z-20 p-8 md:p-12 h-full flex flex-col justify-end">
              <Badge className="bg-[#FF9900] text-white border-none mb-4 px-6 py-1 w-fit font-semibold shadow-lg uppercase tracking-wider">
                World Cup Qualifier
                </Badge>
    
    {/* Added drop-shadow to text to keep it readable against the bright image */}
    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
      Zambia <span className="text-[#FF9900]">vs</span> Malawi
    </h1>
    
    <div className="flex flex-wrap gap-8 text-white font-medium text-sm md:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      <span className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-[#FF9900]" /> Jan 25, 2026
      </span>
      <span className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-[#FF9900]" /> 15:00 CAT
      </span>
      <span className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-[#FF9900]" /> Levy Mwanawasa, Ndola
                  </span>
                </div>
              </div>
          </div>

      <main className="flex-1 container mx-auto px-4 -mt-8 pb-20 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: SEATING MAP */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-white">
              <CardHeader className="bg-[#0e633d] py-4 px-8">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Target className="h-5 w-5 text-[#ef7d00]" /> 
                  <span className="tracking-tight font-bold uppercase italic text-sm">Select Seating Experience</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Wing Selection */}
                <div className="bg-slate-50/50 p-4 grid grid-cols-2 md:grid-cols-5 gap-3 border-b border-slate-100">
                  {STADIUM_MAP.blocks.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setSelectedBlockId(b.id); setSelectedRowNumber(null); setSelectedSeatNumbers([]); }}
                      className={`flex flex-col items-start p-3 rounded-2xl transition-all duration-300 text-left border-2 ${
                        selectedBlockId === b.id 
                        ? "bg-white border-[#0e633d] shadow-md scale-[1.02]" 
                        : "bg-white/5 border-transparent hover:border-slate-200"
                      }`}
                    >
                      <p className={`font-black text-[10px] uppercase tracking-tight mb-0.5 ${selectedBlockId === b.id ? "text-[#0e633d]" : "text-slate-500"}`}>
                        {b.wing}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{b.gate}</p>
                      <p className="mt-1 text-[#ef7d00] font-black text-xs italic">K{b.price}</p>
                    </button>
                  ))}
                </div>

                {selectedBlock ? (
                  <div className="bg-[#0e633d] p-6 md:p-10 relative overflow-hidden min-h-[500px] flex flex-col">
                    {/* Legend */}
                    <div className="flex flex-wrap justify-between items-center mb-8 gap-4 z-20">
                      <div className="flex gap-4 bg-black/40 p-3 rounded-xl backdrop-blur-md border border-white/10">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-white" />
                          <span className="text-[9px] font-semibold text-white uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-[#FF9900]" />
                          <span className="text-[9px] font-semibold text-white uppercase">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-sm bg-white/10" />
                          <span className="text-[9px] font-semibold text-white/30 uppercase">Sold</span>
                        </div>
                      </div>

                      {selectedRow && (
                        <Badge className="bg-[#FF9900] text-white border-none px-3 py-1 text-[10px] font-semibold">
                          {selectedRow.seats.filter(s => s.status === 'available').length} SEATS REMAINING
                        </Badge>
                      )}
                    </div>

                    {/* Perspective Seating Grid */}
                    <div style={{ perspective: '1500px' }} className="flex-1 flex flex-col justify-center">
                      <div style={{ transform: 'rotateX(10deg)' }} className="flex flex-col items-center">
                        
                        {/* Row Selection Circle Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                          {selectedBlock.rows.map((r) => (
                            <button
                              key={r.rowNumber}
                              onClick={() => { setSelectedRowNumber(r.rowNumber); setSelectedSeatNumbers([]); }}
                              className={`w-10 h-10 rounded-full font-bold text-xs transition-all border-2 flex items-center justify-center ${
                                selectedRowNumber === r.rowNumber 
                                ? "bg-[#FF9900] border-[#FF9900] text-white shadow-lg scale-110" 
                                : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                              }`}
                            >
                              R{r.rowNumber}
                            </button>
                          ))}
                        </div>

                        {/* Interactive Seat Layout */}
                        {selectedRow ? (
                          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-3">
                            {selectedRow.seats.map((s) => {
                              const isSelected = selectedSeatNumbers.includes(s.seatNumber);
                              const isSold = s.status === "sold";
                              return (
                                <button
                                  key={s.seatNumber}
                                  disabled={isSold}
                                  onClick={() => toggleSeat(s.seatNumber)}
                                  className={`relative w-10 h-12 rounded-t-xl transition-all border-b-[4px] flex items-center justify-center font-bold text-[10px] ${
                                    isSold 
                                    ? "bg-white/5 border-white/5 opacity-10 cursor-not-allowed" 
                                    : isSelected 
                                      ? "bg-[#FF9900] border-[#CC7A00] -translate-y-2 shadow-lg text-white" 
                                      : "bg-white border-slate-300 text-[#0e633d]"
                                  }`}
                                >
                                  {s.seatNumber}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-12 text-center space-y-3">
                             <RowsIcon className="h-12 w-12 text-white/10 mx-auto" />
                             <p className="text-white/40 font-semibold uppercase tracking-[0.2em] text-[9px]">Select a row to view seats</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center bg-white">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/1200px-Flag_of_Zambia.svg.png" className="w-16 h-10 mx-auto mb-4 opacity-20 object-cover rounded-md" alt="Zambia" />
                    <h3 className="text-xl font-bold text-[#0e633d] uppercase">Select a Wing</h3>
                    <p className="text-slate-400 text-sm font-medium">Choose a section to begin booking.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY (Sticky) */}
          <div className="lg:col-span-4">
            <Card className="sticky top-28 border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-[#0e633d] py-8 border-b border-white/10">
                <CardTitle className="text-[#ef7d00] text-center uppercase tracking-[0.2em] font-black italic text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {!selectedBlock ? (
                  <div className="text-center py-24 opacity-10">
                    <SeatIcon className="h-16 w-16 mx-auto mb-4" />
                    <p className="font-black uppercase tracking-widest text-[10px]">Awaiting selection</p>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone</p>
                          <p className="text-2xl font-black text-[#0e633d] leading-none">{selectedBlock.wing}</p>
                          <p className="text-[10px] font-bold text-slate-400">{selectedBlock.name}</p>
                        </div>
                        <div className="bg-[#0e633d] text-white px-5 py-3 rounded-2xl text-center shadow-lg">
                           <p className="text-[8px] font-bold uppercase opacity-60 mb-1">Gate</p>
                           <p className="text-xl font-black text-[#ef7d00] italic">{selectedBlock.gate.split(' ')[1]}</p>
                        </div>
                      </div>

                      {selectedRow && (
                        <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 grid grid-cols-2 gap-4">
                           <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase">Row</p>
                             <p className="text-3xl font-black text-[#0e633d]">{selectedRow.rowNumber}</p>
                           </div>
                           <div className="text-right">
                             <p className="text-[9px] font-black text-slate-400 uppercase">Seats</p>
                             <p className="text-xl font-black text-[#ef7d00]">
                               {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(", ") : "—"}
                             </p>
                           </div>
                        </div>
                      )}

                      <Separator className="bg-slate-100" />

                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Price per seat</span>
                          <span className="text-slate-900">ZMW {selectedBlock.price.toFixed(2)}</span>
                        </div>
                        <div className="pt-4 flex justify-between items-end">
                           <span className="font-black text-[#0e633d] text-lg uppercase">Total Amount</span>
                           <p className="text-2xl font-black text-[#0e633d] tracking-tighter">
                             K <span className="text-[#ef7d00]">{totalPrice.toFixed(2)}</span>
                           </p>
                        </div>
                      </div>

                      <Button 
                        onClick={handleAddToCart}
                        disabled={selectedSeatNumbers.length === 0}
                        className="w-full h-16 rounded-2xl bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-black uppercase italic tracking-widest shadow-xl transition-all disabled:opacity-20 group"
                      >
                        Secure Tickets
                        <ChevronRight className="ml-2 h-5 w-5 text-[#ef7d00] group-hover:translate-x-1 transition-transform" />
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                         <ShieldCheck className="h-4 w-4 text-[#ef7d00]" /> Official FAZ Secure Portal
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