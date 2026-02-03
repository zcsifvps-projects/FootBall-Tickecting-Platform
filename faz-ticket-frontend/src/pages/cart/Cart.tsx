import { useNavigate } from "react-router-dom";
import { 
  Trash2, 
  ChevronRight, 
  ArrowLeft, 
  Ticket, 
  ShieldCheck, 
  Info 
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
    <div className="min-h-screen flex flex-col bg-[#F8FAF8]">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-[#1A3D1D]">
                Your <span className="text-[#FF9900]">Cart</span>
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">
                Review your selections before checkout
              </p>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="font-black uppercase italic text-xs hover:bg-[#1A3D1D]/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Add More
            </Button>
          </div>

          {cart.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
              <Ticket className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-xl font-black uppercase text-slate-400">Your cart is empty</h2>
              <Button 
                onClick={() => navigate('/')}
                className="mt-6 bg-[#1A3D1D] rounded-xl font-black uppercase italic"
              >
                Find a Match
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Ticket List */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.matchId}-${index}`}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
                  >
                    {/* Decorative Sidestrip */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#1A3D1D]" />
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-4 flex-1">
                        <div>
                          <Badge className="bg-[#FF9900]/10 text-[#FF9900] border-none font-black italic mb-2">
                            {item.stadium}
                          </Badge>
                          <h3 className="text-2xl font-black italic uppercase text-[#1A3D1D] leading-tight">
                            {item.matchName}
                          </h3>
                          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                            {item.date}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                          <div className="bg-[#F8FAF8] p-3 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Wing</p>
                            <p className="text-xs font-black text-[#1A3D1D] uppercase">{item.zone}</p>
                          </div>
                          <div className="bg-[#F8FAF8] p-3 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Gate</p>
                            <p className="text-xs font-black text-[#FF9900]">{item.gate}</p>
                          </div>
                          <div className="bg-[#F8FAF8] p-3 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Row</p>
                            <p className="text-xs font-black text-[#1A3D1D]">{item.row}</p>
                          </div>
                          <div className="bg-[#F8FAF8] p-3 rounded-2xl">
                            <p className="text-[8px] font-black text-slate-400 uppercase">Seats</p>
                            <p className="text-xs font-black text-[#1A3D1D]">{item.seats.join(", ")}</p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end gap-8">
                        <button 
                          onClick={() => removeFromCart(index)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase">Subtotal</p>
                          <p className="text-xl font-black text-[#1A3D1D] italic">
                            ZMW {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-4">
                <div className="bg-[#1A3D1D] rounded-[3rem] p-10 text-white shadow-2xl shadow-[#1A3D1D]/30 sticky top-32">
                  <h2 className="text-xl font-black italic uppercase tracking-widest text-[#FF9900] mb-8 border-b border-white/10 pb-4">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center text-sm font-bold uppercase italic opacity-60">
                      <span>Base Fare</span>
                      <span>ZMW {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold uppercase italic opacity-60">
                      <span>Booking Fee</span>
                      <span>ZMW 0.00</span>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex justify-between items-end">
                      <span className="font-black uppercase italic tracking-tighter text-lg">Total Amount</span>
                      <div className="text-right">
                        <p className="text-4xl font-black text-[#FF9900] italic leading-none tracking-tighter">
                          K {totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/checkout')}
                    className="w-full h-16 bg-white hover:bg-[#FF9900] text-[#1A3D1D] hover:text-white rounded-[1.5rem] font-black uppercase italic transition-all active:scale-95 shadow-xl group"
                  >
                    Proceed to Payment
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <div className="mt-8 flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <ShieldCheck className="h-8 w-8 text-[#FF9900]" />
                    <p className="text-[9px] font-bold uppercase leading-relaxed text-white/50">
                      Safe & Secure checkout. Digital tickets delivered instantly to your phone via SMS/Email.
                    </p>
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