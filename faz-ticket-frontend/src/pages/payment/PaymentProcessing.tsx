import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, Download, Ticket, 
  ChevronRight, MapPin, Share2 
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const orderDetails = {
    orderId: "FAZ-2025-001234",
    match: "Zambia vs Malawi",
    date: "Sat, 25 Jan 2025 • 15:00",
    stadium: "National Heroes Stadium, Lusaka",
    zone: "Covered Stand",
    tickets: 2,
    total: 292.32,
  };

  useEffect(() => {
    async function saveTicket() {
      try {
        // Save ticket to backend
        const res = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderDetails),
        });

        if (!res.ok) throw new Error("Failed to save ticket");

        // Fetch updated tickets
        const ticketsRes = await fetch("/api/tickets");
        if (!ticketsRes.ok) throw new Error("Failed to fetch tickets");

        const userTickets = await ticketsRes.json();
        console.log("User Tickets:", userTickets);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    saveTicket();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-16 relative">
        <div className="max-w-2xl mx-auto relative z-10">

          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#0e633d]/10 mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-[#0e633d] animate-ping opacity-20" />
              <CheckCircle2 className="h-14 w-14 text-[#0e633d] relative z-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight mb-3">
              Booking <span className="text-[#0e633d]">Confirmed!</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Get ready! Your tickets have been sent to <span className="text-slate-900 font-bold">your email address.</span>
            </p>
          </div>

          {/* Stylized Digital Receipt/Ticket */}
          <Card className="mb-8 border-none shadow-2xl shadow-slate-200 rounded-[2.5rem] overflow-hidden">
            <div className="bg-[#0e633d] p-4 text-center">
              <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Official FAZ Match Pass</span>
            </div>
            <CardContent className="p-8 md:p-10">
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-none mb-2 uppercase italic">{orderDetails.match}</h2>
                    <div className="flex items-center gap-2 text-[#0e633d] font-bold text-sm">
                      <MapPin className="h-3 w-3" />
                      {orderDetails.stadium}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="font-mono font-bold text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                      {orderDetails.orderId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="font-bold text-slate-800">{orderDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Seating Zone</p>
                    <p className="font-bold text-slate-800">{orderDetails.zone}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      <Ticket className="h-5 w-5 text-[#0e633d]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Quantity</p>
                      <p className="font-black text-slate-900">{orderDetails.tickets} Tickets</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Total Paid</p>
                    <p className="text-3xl font-black text-[#0e633d] italic tracking-tighter">
                      ZMW {orderDetails.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Tear-off visual */}
            <div className="relative h-6 bg-slate-50 border-t border-dashed border-slate-200">
              <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#F8FAFC] rounded-full" />
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F8FAFC] rounded-full" />
            </div>
          </Card>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Button 
              className="h-16 bg-[#0e633d] hover:bg-[#0a4a2e] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#0e633d]/20 transition-all active:scale-95"
              onClick={() => navigate("/account/tickets")}
              disabled={loading}
            >
              <Ticket className="mr-2 h-5 w-5" />
              {loading ? "Loading..." : "View My Tickets"}
            </Button>
            <Button 
              variant="outline" 
              className="h-16 border-2 border-[#0e633d] text-[#0e633d] hover:bg-[#0e633d]/5 rounded-2xl font-bold text-lg transition-all"
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
          </div>

          {/* Helpful Tips Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-black text-slate-900 uppercase italic tracking-tight flex items-center gap-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full" />
              Important Information
            </h3>
            <div className="grid gap-4">
              {[ 
                { icon: CheckCircle2, text: "Gates open 2 hours before kickoff. Arrive early!" },
                { icon: Share2, text: "Sharing is caring. Send a ticket copy to your companions." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <item.icon className="h-5 w-5 text-[#0e633d] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-600 leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Shopping */}
          <div className="text-center mt-12 pb-8">
            <button 
              onClick={() => navigate("/")}
              className="group inline-flex items-center gap-2 text-[#0e633d] font-black uppercase italic tracking-widest text-sm hover:gap-4 transition-all"
            >
              Back to Home <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
