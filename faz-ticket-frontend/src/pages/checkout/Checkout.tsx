import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  ArrowLeft,
  Info,
  MapPin,
  Loader2 // Added for the loading effect
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/types/ticket";

/* Local Badge */
const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide",
      className
    )}
  >
    {children}
  </span>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  const [momoProvider, setMomoProvider] = useState<"mtn" | "airtel" | "zamtel">("mtn");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // NEW: Processing state

  /* Guard: No cart data */
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  /* Derived Order Data */
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const primaryItem = cart[0];

  /* ==========================================
     SIMULATED PAYMENT PAUSE
     ========================================== */
  const handleCompleteOrder = () => {
    setIsProcessing(true);
    
    // Simulating the "Verifying Payment" pause
    setTimeout(() => {
      navigate("/payment/success", {
        state: {
          items: cart,
          total: total,
          orderId: `FAZ-${Math.floor(100000 + Math.random() * 900000)}`,
        },
      });
      setIsProcessing(false);
    }, 2500); // 2.5 second delay
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative">
      
      {/* LOADING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="flex flex-col items-center">
            <div className="relative">
               <Loader2 className="h-12 w-12 text-[#0e633d] animate-spin mb-4" />
               <div className="absolute inset-0 h-12 w-12 border-4 border-slate-100 rounded-full -z-10"></div>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Verifying Payment</h3>
            <p className="text-slate-500 font-medium mt-1">Please do not refresh the page...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#0e633d] font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </button>
          <div className="flex items-center gap-2 text-[#0e633d] font-bold uppercase text-[10px] tracking-widest">
            <Lock className="h-3.5 w-3.5" /> Secure Checkout
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          
          {/* Payment Section */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Details</h1>
              <p className="text-slate-500 font-medium">Complete your purchase via Mobile Money.</p>
            </div>

            <section className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Smartphone className="h-5 w-5 text-[#0e633d]" />
                <h2 className="font-bold text-lg text-slate-800">Mobile Money</h2>
              </div>

              {/* Providers */}
              <div className="grid grid-cols-3 gap-4">
                {(["mtn", "airtel", "zamtel"] as const).map((provider) => {
                  const brandColors = {
                    mtn: "bg-[#FFCC00]", 
                    airtel: "bg-[#FF0000]", 
                    zamtel: "bg-[#00AC51]", 
                  };

                  return (
                    <div
                      key={provider}
                      onClick={() => setMomoProvider(provider)}
                      className={cn(
                        "cursor-pointer rounded-2xl border-2 p-5 text-center transition-all",
                        momoProvider === provider
                          ? "border-[#0e633d] bg-[#0e633d]/5 shadow-sm"
                          : "border-slate-100 bg-slate-50 hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                          "h-12 w-12 rounded-full mx-auto mb-3 flex items-center justify-center font-black text-white uppercase shadow-md",
                          brandColors[provider]
                        )}>
                        {provider[0]}
                      </div>
                      <span className="font-bold text-[10px] uppercase tracking-widest text-slate-600">
                        {provider}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3">
                <Label className="font-bold text-slate-700 ml-1">Mobile Number</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold border-r pr-3 my-2">
                    +260
                  </div>
                  <Input
                    className="pl-20 h-14 rounded-xl border-slate-200 focus:ring-[#0e633d] focus:border-[#0e633d]"
                    placeholder="97 000 0000"
                  />
                </div>
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-xs leading-relaxed">
                  <Info className="h-4 w-4 text-[#0e633d] mt-0.5 shrink-0" />
                  <p>A secure payment prompt will be sent to your device. Enter your PIN to authorize the transaction.</p>
                </div>
              </div>
            </section>

            <div className="p-6 bg-white rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(v) => setTermsAccepted(v as boolean)}
                  className="mt-1 data-[state=checked]:bg-[#0e633d] data-[state=checked]:border-[#0e633d]"
                />
                <label htmlFor="terms" className="text-sm text-slate-500 font-medium leading-relaxed cursor-pointer">
                  I agree to the FAZ Ticketing Terms & Conditions. I understand
                  that tickets are digital and non-refundable once issued.
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
                <div className="bg-[#0e633d] p-8 text-white">
                   <h2 className="text-2xl font-bold tracking-tight uppercase">Order Summary</h2>
                </div>

                <CardContent className="p-8 bg-white">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{primaryItem.matchName}</h3>
                      <div className="flex items-center gap-2 mt-2 text-[#0e633d] font-bold text-xs uppercase">
                        <MapPin className="h-3.5 w-3.5" />
                        {primaryItem.stadium}
                      </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="space-y-4 text-sm font-semibold">
                      <div className="flex justify-between text-slate-500">
                        <span>Total Tickets</span>
                        <span className="text-slate-900">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Subtotal</span>
                        <span className="text-slate-900">ZMW {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Total Amount</span>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">ZMW {total.toFixed(2)}</p>
                      </div>
                    </div>

                    <Button
                      disabled={!termsAccepted || isProcessing}
                      onClick={handleCompleteOrder}
                      className={cn(
                        "w-full h-16 mt-4 text-lg font-bold rounded-2xl transition-all shadow-lg active:scale-95",
                        termsAccepted && !isProcessing
                          ? "bg-[#0e633d] hover:bg-[#0c5233] text-white"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {isProcessing ? "Processing..." : "Complete Purchase"}
                      {!isProcessing && <ChevronRight className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}