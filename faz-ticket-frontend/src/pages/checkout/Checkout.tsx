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
  Loader2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

import { useCart } from "@/contexts/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart } = useCart();

  /* Form State */
  const [momoProvider, setMomoProvider] = useState<"mtn" | "airtel" | "zamtel">("mtn");
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); 

  /* Guard: No cart data */
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  /* Derived Order Data */
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;
  const primaryItem = cart[0];

  /* Validation: Zambia numbers are typically 9 digits after +260 */
  const isPhoneValid = phoneNumber.length === 9;
  const canPurchase = termsAccepted && isPhoneValid && !isProcessing;

  const handleCompleteOrder = () => {
    if (!canPurchase) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      navigate("/payment/success", {
        state: {
          items: cart,
          total: total,
          orderId: `FAZ-${Math.floor(100000 + Math.random() * 900000)}`,
          phone: `+260${phoneNumber}`
        },
      });
      setIsProcessing(false);
    }, 2500);
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
            <p className="text-slate-500 font-medium mt-1">Check your phone for the prompt...</p>
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
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    maxLength={9}
                    className={cn(
                      "pl-20 h-14 rounded-xl border-slate-200 focus:ring-[#0e633d] focus:border-[#0e633d]",
                      phoneNumber.length > 0 && !isPhoneValid && "border-orange-500 focus:ring-orange-500"
                    )}
                    placeholder="97XXXXXXX"
                  />
                </div>
                {phoneNumber.length > 0 && !isPhoneValid && (
                  <p className="text-[10px] text-orange-600 font-bold uppercase mt-1 ml-1">
                    Please enter a valid number
                  </p>
                )}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-xs leading-relaxed">
                  <Info className="h-4 w-4 text-[#0e633d] mt-0.5 shrink-0" />
                  <p>A secure payment prompt will be sent to your device. Enter your PIN to authorize the transaction.</p>
                </div>
              </div>
            </section>

            <div className="flex items-start space-x-3 py-2">
              <Checkbox 
                id="terms" 
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                className="mt-1 border-slate-300 data-[state=checked]:bg-[#0e633d] data-[state=checked]:border-[#0e633d]" 
              />
              <label htmlFor="terms" className="text-sm text-slate-500 font-medium leading-relaxed cursor-pointer">
                I agree to the FAZ Ticketing{" "}
                <Dialog>
                  <DialogTrigger asChild>
                    <button type="button" className="text-[#0e633d] hover:underline font-semibold cursor-pointer">
                      Terms & Conditions
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl w-[90vw] p-0 overflow-hidden border-none rounded-[40px] bg-white shadow-2xl">
                    <div className="h-2 bg-gradient-to-r from-[#0e633d] via-[#ef7d00] to-[#0e633d]" />
                    <div className="p-10">
                      <DialogHeader className="mb-8">
                        <DialogTitle className="text-3xl font-black text-slate-900 tracking-tight">
                          The Fan <span className="text-[#0e633d]">Agreement</span>
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium mt-1">
                          Fair play for every fan at the Stadium.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {[
                          { title: "100% Digital Entry", icon: <Smartphone className="h-5 w-5 text-[#ef7d00]" />, desc: "Your phone is your ticket. No printed passes required. Present your phone and scan the QR code at the stadium entrance." },
                          { title: "All Sales Final", icon: <CheckCircle2 className="h-5 w-5 text-[#ef7d00]" />, desc: "Tickets cannot be refunded or exchanged once issued. Please review all details carefully before purchasing." },
                          { title: "Stadium Security", icon: <ShieldCheck className="h-5 w-5 text-[#ef7d00]" />, desc: "Entry is subject to standard safety checks at the Stadium. Do not bring any prohibited items." }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4">
                            <div className="w-9 h-9 rounded-full bg-[#ef7d00]/10 flex items-center justify-center shrink-0">{item.icon}</div>
                            <div>
                              <h4 className="font-bold text-slate-900">{item.title}</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                         <DialogTrigger asChild>
                            <Button className="h-14 px-10 bg-[#0e633d] hover:bg-[#0a4a2e] text-white rounded-2xl font-bold">
                              I Understand 
                            </Button>
                         </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                . I understand that tickets are digital and non-refundable.
              </label>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <Card className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl bg-white">
                <div className="bg-[#0e633d] px-8 py-6 text-white text-center">
                  <h2 className="text-2xl font-bold tracking-tight uppercase">Order Summary</h2>
                </div>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{primaryItem.matchName}</h3>
                      <div className="flex items-center gap-2 mt-2 text-[#0e633d] font-semibold text-xs uppercase">
                        <MapPin className="h-3.5 w-3.5 text-[#ef7d00]" />
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
                        <p className="text-3xl font-black tracking-tighter">
                          ZMW <span className="text-[#0e633d]">{total.toFixed(2)}</span>
                        </p>
                      </div>
                    </div>

                    <Button
                      disabled={!canPurchase}
                      onClick={handleCompleteOrder}
                      className={cn(
                        "w-full h-16 mt-4 text-lg font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3",
                        canPurchase
                          ? "bg-[#0e633d] hover:bg-[#0a4a2e] text-white cursor-pointer active:scale-95"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                      )}
                    >
                      {isProcessing ? "Processing..." : "Complete Purchase"}
                      {!isProcessing && <ChevronRight className={cn("h-5 w-5", canPurchase ? "text-[#ef7d00]" : "text-slate-400")} />}
                    </Button>
                    
                    {!isPhoneValid && phoneNumber.length > 0 && (
                      <p className="text-center text-[11px] font-bold text-orange-600 uppercase">
                        Finish entering your phone number
                      </p>
                    )}
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