import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  Download,
  Ticket,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, total, orderId } = location.state || {
    items: [],
    total: 0,
    orderId: "FAZ-240033",
  };

  const primaryMatch = items.length > 0 ? items[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        {/* HEADER */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500 print:hidden">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0e633d] mb-4 shadow-lg shadow-[#0e633d]/20">
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#0e633d]">
            Payment Successful
          </h1>

          <div className="mt-4 inline-block px-4 py-1 bg-white rounded-full border border-[#0e633d]/15 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0e633d]">
              Order <span className="text-[#ef7d00]">#{orderId}</span> Confirmed
            </p>
          </div>
        </div>

 {/* TICKET CONTAINER */}
<div className="w-full max-w-[720px] mx-auto">
  <Card className="relative overflow-hidden rounded-[2.75rem] bg-white shadow-[0_50px_100px_rgba(14,99,61,0.18)] flex flex-col md:flex-row min-h-[260px] border-none">

    {/* FULL BACKGROUND LAYER */}
    <div className="absolute inset-0 z-0">
      <img
        src="https://res.cloudinary.com/dceqpo559/image/upload/v1770291402/levy_mwanawasa_stadium02_iachgn.jpg"
        alt="Levy Mwanawasa Stadium"
        className="w-full h-full object-cover opacity-55 saturate-125"
      />

      {/* Color Control Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-white/40" />
    </div>

    {/* FAZ WATERMARK */}
    <img
      src="https://res.cloudinary.com/dceqpo559/image/upload/v1769602379/faz_logo_cl3wx5.png"
      alt="FAZ Watermark"
      className="absolute left-12 top-1/2 -translate-y-1/2 w-[280px] opacity-[0.07] z-0 pointer-events-none"
    />

    {/* LEFT SECTION */}
    <div className="relative z-10 flex-[2.6] p-10 flex flex-col justify-between">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#ef7d00] mb-4">
          <ShieldCheck size={16} strokeWidth={3} />
          Official Match Pass
        </div>

        <h2 className="text-[38px] font-black text-[#0e633d] leading-[1.05] tracking-tight mb-4">
          {primaryMatch?.matchName || "ZAMBIA VS MALAWI"}
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-[14px] font-bold text-[#0e633d]">
            <MapPin size={16} className="text-[#ef7d00]" />
            {primaryMatch?.stadium || "Levy Mwanawasa Stadium, Ndola"}
          </div>

          <div className="flex items-center gap-2 text-[12px] font-black text-[#0e633d] bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#0e633d]/10 shadow-sm">
            <Timer size={16} className="text-[#ef7d00]" />
            15:00 CAT
          </div>
        </div>
      </div>

      {/* Seating */}
      <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#0e633d]/20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0e633d]/60 mb-1">
            Wing/Gate
          </p>
          <p className="text font-black text-[#0e633d]">
            {items[0]?.zone || "NORTH WING"}
            <span className="text-[#ef7d00] ml-1">{items[0]?.gate || "9"}</span>
          </p>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0e633d]/60 mb-1">
            Row
          </p>
          <p className="text font-black text-[#0e633d]">
            {items[0]?.row || "8"}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#0e633d]/60 mb-1">
            Seat(s)
          </p>
          <p className="text font-black text-[#0e633d]">
            {items[0]?.seats?.join(", ") || "19, 20"}
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SECTION – QR STUB */}
    <div className="relative z-10 flex-1 p-10 border-l-2 border-dashed border-[#0e633d]/20 flex flex-col items-center justify-center text-center bg-white/60 backdrop-blur-md">

      <div className="bg-white p-5 rounded-[1.5rem] shadow-xl border border-[#0e633d]/10 mb-6">
        <QRCodeCanvas
          value={orderId}
          size={100}
          level="H"
          fgColor="#0e633d"
        />
      </div>

      <div className="space-y-1">
        <p className="text-[11px] font-mono font-bold text-slate-400 tracking-widest">
          #{orderId.split("-")[1] || "551074"}
        </p>

        <p className="text-xl font-black text-[#0e633d]">
          ZMW K{total.toFixed(2)}
        </p>

        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#ef7d00] mt-2">
          Scan at Gate
        </p>
      </div>
    </div>
  </Card>

          {/* ACTIONS */}
          <div className="grid grid-cols-2 gap-4 mt-8 print:hidden">
            <Button
              className="bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold h-12 rounded-2xl shadow-lg shadow-[#0e633d]/20 text-xs uppercase"
              onClick={() => navigate("/account/tickets")}
            >
              <Ticket className="mr-2 h-4 w-4" /> View Tickets
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-2xl font-bold border-[#ef7d00]/40 text-[#ef7d00] hover:bg-[#ef7d00]/5 text-xs uppercase"
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full text-center mt-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0e633d]/60 hover:text-[#ef7d00] transition-colors flex items-center justify-center gap-1 print:hidden"
          >
            Return to Home <ChevronRight size={12} />
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}