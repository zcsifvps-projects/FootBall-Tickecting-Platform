import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  CreditCard,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Ticket,
  ArrowLeft,
  Info,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const [paymentMethod, setPaymentMethod] = useState<"momo" | "card">("momo");
  const [momoProvider, setMomoProvider] = useState<
    "mtn" | "airtel" | "zamtel"
  >("mtn");
  const [termsAccepted, setTermsAccepted] = useState(false);

  /* ===============================
     Guard: No cart data
  =============================== */
  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  /* ===============================
     Derived Order Data
  =============================== */
  const totalTickets = cart.reduce<number>(
    (sum: number, item: CartItem) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce<number>(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const bookingFee = subtotal * 0.05;
  const vat = (subtotal + bookingFee) * 0.16;
  const total = subtotal + bookingFee + vat;

  const primaryItem = cart[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-slate-500 hover:text-[#0e633d] font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </button>
          <div className="flex items-center gap-2 text-[#0e633d] font-bold">
            <Lock className="h-4 w-4" /> Secure Checkout
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* ===============================
              Payment Section
          =============================== */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Payment Details</h1>
              <p className="text-slate-500 font-medium">
                Choose your preferred payment method.
              </p>
            </div>

            <section className="bg-white rounded-3xl p-8 border">
              <Tabs
                  value={paymentMethod}
                    onValueChange={(value) =>
                       setPaymentMethod(value as "momo" | "card")
                         }
                    >
                <TabsList className="grid grid-cols-2 h-14 bg-slate-100 p-1 rounded-xl mb-8">
                  <TabsTrigger value="momo" className="font-bold">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile Money
                  </TabsTrigger>
                  <TabsTrigger value="card" className="font-bold">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Bank Card
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="momo" className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {(["mtn", "airtel", "zamtel"] as const).map((provider) => (
                      <div
                        key={provider}
                        onClick={() => setMomoProvider(provider)}
                        className={cn(
                          "cursor-pointer rounded-2xl border-2 p-4 text-center",
                          momoProvider === provider
                            ? "border-[#0e633d] bg-[#0e633d]/5"
                            : "border-slate-100 bg-slate-50"
                        )}
                      >
                        <div className="h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-white uppercase bg-[#0e633d]">
                          {provider[0]}
                        </div>
                        <span className="font-bold text-xs uppercase">
                          {provider}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label className="font-bold">Mobile Number</Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 border-r pr-3">
                        +260
                      </div>
                      <Input
                        className="pl-20 h-14"
                        placeholder="97 000 0000"
                      />
                    </div>
                    <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
                      <Info className="h-4 w-4" />
                      <p>
                        A payment prompt will be sent to your phone to confirm.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="card">
                  <div className="grid gap-4">
                    <Input placeholder="Cardholder Name" />
                    <Input placeholder="Card Number" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="MM/YY" />
                      <Input placeholder="CVV" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            <div className="p-6 bg-[#0e633d]/5 rounded-2xl border">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={termsAccepted}
                  onCheckedChange={(v) => setTermsAccepted(v as boolean)}
                />
                <p className="text-sm text-slate-600">
                  I agree to FAZ Terms & Conditions. Tickets are non-refundable.
                </p>
              </div>
            </div>
          </div>

          {/* ===============================
              Order Summary
          =============================== */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <Card className="rounded-[2rem] overflow-hidden shadow-xl">
                <div className="bg-[#0e633d] p-6 text-white flex justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-6 w-6 text-yellow-400" />
                    <span className="font-bold uppercase">
                      Order Summary
                    </span>
                  </div>
                  <Badge className="bg-white/20 text-white">
                    Official Ticket
                  </Badge>
                </div>

                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-1">
                    Match ID: {primaryItem.matchId}
                  </h2>
                  <p className="text-[#0e633d] font-bold text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {primaryItem.zone} — Gate {primaryItem.gate}
                  </p>

                  <div className="space-y-3 mt-6 text-sm">
                    <div className="flex justify-between">
                      <span>Total Tickets</span>
                      <span>{totalTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>ZMW {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees + VAT</span>
                      <span>
                        ZMW {(bookingFee + vat).toFixed(2)}
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-black">
                      <span>Total</span>
                      <span className="text-[#0e633d]">
                        ZMW {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    disabled={!termsAccepted}
                    onClick={() => navigate("/payment/processing")}
                    className={cn(
                      "w-full h-16 mt-6 text-lg font-black",
                      termsAccepted
                        ? "bg-[#0e633d] text-white"
                        : "bg-slate-200 text-slate-400"
                    )}
                  >
                    Complete Order
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-6 mt-6 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" /> Secure
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
