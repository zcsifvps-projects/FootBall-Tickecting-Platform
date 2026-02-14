import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ChevronRight,
  ArrowLeft,
  Ticket,
  ShieldCheck,
  Calendar,
  MapPin,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Cart() {
  const { cart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F4]">
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-[#0e633d]">
                Shopping <span className="text-[#ef7d00]">Cart</span>
              </h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                {cart.length} {cart.length === 1 ? "item" : "items"} in your selection
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="rounded-full border-[#0e633d] text-[#0e633d] font-bold hover:bg-[#0e633d] hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Add More Tickets
            </Button>
          </div>

          {/* EMPTY STATE */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border shadow-sm">
              <Ticket className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-400">
                Your cart is empty
              </h2>
              <Button
                onClick={() => navigate("/")}
                className="mt-6 bg-[#0e633d] hover:bg-[#0b5232] rounded-xl px-8"
              >
                Browse Matches
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">

              {/* TICKETS */}
              <div className="lg:col-span-7 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={`${item.matchId}-${index}`}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between">

                        {/* LEFT */}
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-[#ef7d00]/10 text-[#ef7d00] border-none font-bold px-3">
                              {item.stadium}
                            </Badge>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Match ID: {item.matchId}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold text-[#0e633d] uppercase tracking-tight">
                            {item.matchName}
                          </h3>

                          <div className="flex gap-6 text-slate-500 text-xs font-semibold uppercase">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-[#ef7d00]" />
                              {item.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-[#ef7d00]" />
                              {item.zone}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-2 flex-wrap">
                            {[
                              `Gate ${item.gate}`,
                              `Row ${item.row}`,
                              `Seats: ${item.seats.join(", ")}`,
                            ].map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-6 ml-4">
                          <button
                            onClick={() => removeFromCart(index)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>

                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Subtotal
                            </p>
                            <p className="text-xl font-bold text-[#0e633d]">
                              ZMW {item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="lg:col-span-5">
                <div className="sticky top-32">
                  <div className="bg-[#0e633d] rounded-[2.5rem] p-8 text-white shadow-xl">

                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-lg font-bold uppercase tracking-widest">
                        Order Summary
                      </h2>
                      <Ticket className="h-5 w-5 text-[#ef7d00]" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm font-medium text-white/70 uppercase">
                        <span>Items</span>
                        <span>{cart.length}</span>
                      </div>

                      <div className="flex justify-between text-sm font-medium text-white/60 uppercase">
                        <span>Platform Fee</span>
                        <span className="text-[#ef7d00]">ZMW 0.00</span>
                      </div>

                      <Separator className="bg-white/10 my-6" />

                      <div className="flex justify-between items-center">
                        <span className="font-bold uppercase text-sm tracking-widest text-white/70">
                          Total Amount
                        </span>
                        <p className="text-3xl font-bold text-white tracking-tighter">
                          ZMW {totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate("/checkout")}
                      className="w-full h-16 mt-10 bg-[#ef7d00] hover:bg-[#d96f00] text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg"
                    >
                      Proceed to Checkout
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>

                    <div className="mt-8 flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
                      <ShieldCheck className="h-5 w-5 text-[#ef7d00]" />
                      <p className="text-[10px] font-medium leading-tight text-white/70 uppercase tracking-wider">
                        Secure SSL Encryption. Official FAZ Ticketing Partner.
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
