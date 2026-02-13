import { useState, useEffect } from "react";
import { Download, QrCode, Calendar, MapPin, Clock, Ticket as TicketIcon, Info } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Define TypeScript type for a ticket
type Ticket = {
  id: string;
  match: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  zone: string;
  section: string;
  row: string;
  seats: string[];
  quantity: number;
  total: number;
  orderDate: string;
  attended?: boolean; // optional because not all tickets have it
};

// Props for TicketCard component
type TicketCardProps = {
  ticket: Ticket;
  isPast?: boolean;
};

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingTickets, setUpcomingTickets] = useState<any[]>([]);

  // Load tickets from storage on mount
  useEffect(() => {
    const loadTickets = () => {
      // 1. Get real tickets from localStorage (from PaymentSuccess)
      const savedTickets = JSON.parse(localStorage.getItem("my-tickets") || "[]");
      
      // 2. Your default/mock tickets for UI testing
      const defaultTickets = [
        {
          id: "TKT-002",
          match: "ZESCO United vs Zanaco",
          competition: "Super League",
          date: "Sun, 20 Feb 2026",
          time: "14:00",
          stadium: "Levy Mwanawasa Stadium",
          city: "Ndola",
          zone: "VIP Stand",
          row: "5",
          seats: ["8"],
          total: 180.0,
        },
      ];

      // Combine real tickets (newest first) with default ones
      setUpcomingTickets([...savedTickets, ...defaultTickets]);
    };

    loadTickets();
  }, []);

  const pastTickets: Ticket[] = [
    {
      id: "TKT-000",
      match: "Zambia vs Kenya",
      competition: "Friendly",
      date: "Sat, 5 Oct 2025",
      time: "18:00",
      stadium: "National Heroes Stadium",
      city: "Lusaka",
      zone: "West Wing",
      row: "5",
      seats: ["10"],
      total: 95.0,
      attended: true,
    },
  ];

              </Badge>
  // TicketCard component with proper types
  const TicketCard = ({ ticket, isPast = false }: TicketCardProps) => (
    <Card className="group hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Ticket Details */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">{ticket.match}</h3>
                <Badge variant="secondary" className="mb-3">
                  {ticket.competition}
                </Badge>
              </div>
              {isPast && ticket.attended && (
                <Badge className="bg-orange-100 text-orange-600 border-none font-black italic uppercase text-[10px]">
                  Attended
                </Badge>
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase italic text-slate-900 leading-tight tracking-tighter">
              {ticket.match}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0e633d]">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Match Day</p>
                <p className="font-bold text-slate-800 text-sm">{ticket.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0e633d]">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Kick-off</p>
                <p className="font-bold text-slate-800 text-sm">{ticket.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#0e633d]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400">Venue</p>
                <p className="font-bold text-slate-800 text-sm">{ticket.stadium}, {ticket.city}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-slate-200 grid grid-cols-4 gap-2">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Zone</p>
              <p className="text-xs font-bold truncate">{ticket.zone}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Row</p>
              <p className="text-xs font-bold">{ticket.row}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Seats</p>
              <p className="text-xs font-bold">{Array.isArray(ticket.seats) ? ticket.seats.join(", ") : ticket.seats}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: ACTIONS/QR */}
      <div className={`flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-slate-200 rounded-b-[2rem] md:rounded-r-[2rem] md:rounded-bl-none border-t-2 md:border-l-2 border-dashed border-l-transparent shadow-sm`}>
        {!isPast ? (
          <div className="w-full space-y-4 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100 inline-block mb-2">
              <QrCode className="h-20 w-20 text-slate-900" />
            </div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              ID: {ticket.id}
            </p>
            <div className="flex flex-col gap-2 w-full">
              <Button className="w-full bg-[#0e633d] hover:bg-black text-white font-black uppercase italic text-xs h-11 transition-colors">
                View QR Code
              </Button>
              <Button variant="outline" className="w-full border-2 border-slate-200 font-black uppercase italic text-xs h-11">
                <Download className="mr-2 h-4 w-4 text-orange-500" />
                PDF
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
             <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4">
                <TicketIcon className="h-8 w-8 text-slate-400" />
             </div>
             <p className="text-xs font-black uppercase text-slate-400 italic">Past Event</p>
             <Button variant="link" className="text-[#0e633d] font-black uppercase italic text-[10px] mt-2">
                Download Receipt
             </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-slate-900">
                My <span className="text-[#0e633d]">Tickets</span>
              </h1>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">
                Manage your official match entry passes
              </p>
            </div>
            <div className="h-1.5 w-20 bg-orange-500 rounded-full" />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 h-14 rounded-2xl mb-8 w-full md:w-auto">
              <TabsTrigger value="upcoming" className="rounded-xl px-8 font-black uppercase italic text-xs data-[state=active]:bg-[#0e633d] data-[state=active]:text-white h-full transition-all">
                Upcoming ({upcomingTickets.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-xl px-8 font-black uppercase italic text-xs data-[state=active]:bg-[#0e633d] data-[state=active]:text-white h-full transition-all">
                Past History ({pastTickets.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-0 outline-none">
              {upcomingTickets.length > 0 ? (
                upcomingTickets.map((ticket, idx) => <TicketCard key={`${ticket.id}-${idx}`} ticket={ticket} />)
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-0 outline-none">
              {pastTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} isPast />
              ))}
            </TabsContent>
          </Tabs>

          <div className="mt-12 bg-[#0e633d] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
              <QrCode size={200} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <Info className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black uppercase italic">Entry Protocol</h3>
              </div>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {[
                  "Each QR code is valid for single entry only",
                  "Gates open 2 hours before kick-off",
                  "Keep your digital PDF backup ready",
                  "ID may be required at the turnstiles"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-[3rem] border border-dashed border-slate-300 p-20 text-center">
      <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <QrCode className="h-10 w-10 text-slate-300" />
      </div>
      <h3 className="text-2xl font-black uppercase italic text-slate-900 mb-2">No Active Tickets</h3>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-8">Ready for the next match day?</p>
      <Button className="bg-orange-500 hover:bg-[#0e633d] text-white font-black uppercase italic rounded-xl px-10 h-14 transition-all">
        Find a Match
      </Button>
    </div>
  );
}
