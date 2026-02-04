import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle2, Download, Ticket, ChevronRight, MapPin, 
  Loader2, ShieldCheck, Timer
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(true);

  const { items, total, orderId } = location.state || {
    items: [], total: 0, orderId: "FAZ-240033",
  };

  const primaryMatch = items.length > 0 ? items[0] : null;

  useEffect(() => {
    setTimeout(() => setIsProcessing(false), 1500);
  }, []);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#0e633d] animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center">
        
        {/* CLEAN HEADER */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500 print:hidden">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#0e633d] mb-4">
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Payment Successful</h1>
          <div className="mt-4 inline-block px-4 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
              Order <span className="text-slate-900">#{orderId}</span> Confirmed
            </p>
          </div>
        </div>

        {/* REFINED STATIC TICKET */}
        <div className="w-full max-w-[700px] print:transform-none">
          <Card className="relative overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row min-h-[220px] print:shadow-none print:rounded-none">
            
            {/* Left Content Section */}
            <div className="flex-[2.5] p-8 md:p-10 flex flex-col justify-between relative">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#0e633d] uppercase tracking-wider mb-3">
                  <ShieldCheck size={14} /> Official Match Pass
                </div>
                <h2 className="text-3xl font-bold text-slate-900 leading-none">
                  {primaryMatch?.matchName || "ZAMBIA VS MALAWI"}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-500">
                    <MapPin size={14} className="text-[#0e633d]" /> {primaryMatch?.stadium || "Levy Mwanawasa Stadium, Ndola"}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0e633d] bg-[#0e633d]/5 px-2 py-1 rounded">
                    <Timer size={14} /> 15:00 CAT
                  </div>
                </div>
              </div>

              {/* Seating Details */}
              <div className="flex gap-10 mt-6 pt-6 border-t border-slate-50">
                <div className="grid grid-cols-3 gap-8 w-full">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Wing/Gate</p>
                    <p className="text-sm font-semibold text-slate-800 uppercase">
                      {items[0]?.zone || "VIP Central"} <span className="text-[#0e633d]">{items[0]?.gate || "1"}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Row</p>
                    <p className="text-sm font-semibold text-slate-800">{items[0]?.row || "1"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Seat(s)</p>
                    <p className="text-sm font-semibold text-slate-800">{items[0]?.seats?.join(", ") || "11, 12"}</p>
                  </div>
                </div>
              </div>

              {/* Decorative Notches */}
              <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-[#F8FAFC] rounded-full border border-slate-100 z-10 print:hidden" />
              <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 bg-[#F8FAFC] rounded-full border border-slate-100 z-10 print:hidden" />
            </div>

            {/* Right QR Stub */}
            <div className="flex-1 bg-slate-50/50 border-l border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center print:bg-white print:border-l">
              <div className="bg-white p-2 rounded-xl border border-slate-100 mb-4">
                <QRCodeCanvas 
                  value={orderId} 
                  size={90} 
                  level="H" 
                  fgColor="#0e633d" 
                />
              </div>
              
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-slate-400">#{orderId}</p>
                <p className="text-xl font-bold text-slate-900">
                  ZMW {total.toFixed(2)}
                </p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan at Gate</p>
              </div>
            </div>
          </Card>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-4 mt-8 print:hidden">
            <Button
              className="bg-[#0e633d] hover:bg-[#0a4a2e] text-white font-bold h-12 rounded-xl transition-all shadow-md shadow-[#0e633d]/10 text-xs uppercase"
              onClick={() => navigate("/account/tickets")}
            >
              <Ticket className="mr-2 h-4 w-4" /> View Passes
            </Button>
            <Button 
              variant="outline" 
              className="h-12 rounded-xl font-bold border-slate-200 text-slate-600 transition-all text-xs uppercase"
              onClick={() => window.print()}
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-[#0e633d] transition-colors flex items-center justify-center gap-1 print:hidden"
          >
            Return to Home <ChevronRight size={12} />
          </button>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: portrait; margin: 0; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          main { display: flex !important; align-items: center !important; justify-content: center !important; height: 100vh !important; padding: 0 !important; }
          .container { max-width: 100% !important; }
        }
      `}} />
    </div>
  );
}