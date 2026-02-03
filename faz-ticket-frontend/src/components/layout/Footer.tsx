import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Send, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="relative bg-[#052c1b] text-white overflow-hidden pt-20">
      {/* Decorative background element - a subtle green glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter italic">FAZ<span className="text-emerald-500">TICKETS</span></span>
            </div>
            
            <p className="text-emerald-100/60 text-sm leading-relaxed max-w-sm">
              The official digital gateway to Zambian football. Join thousands of fans in the stadium with our secure, instant QR ticketing system.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-emerald-100/80">
                <MapPin size={16} className="text-emerald-500" />
                <span>Football House, Lusaka, Zambia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-emerald-100/80">
                <Phone size={16} className="text-emerald-500" />
                <span>+260 970 000 000</span>
              </div>
            </div>

            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-6">Explore</h3>
              <ul className="space-y-4 text-sm font-medium">
                {['Browse Matches', 'Stadium Guide', 'Latest Results', 'Fan Zone'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-emerald-100/60 hover:text-white hover:translate-x-1 transition-all inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-6">Support</h3>
              <ul className="space-y-4 text-sm font-medium">
                {['How to Buy', 'My Account', 'Security', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <Link to="#" className="text-emerald-100/60 hover:text-white hover:translate-x-1 transition-all inline-block">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
            <h3 className="text-lg font-bold mb-2">Never Miss a Kick</h3>
            <p className="text-emerald-100/60 text-sm mb-6">
              Get matchday alerts and early-bird ticket access directly in your inbox.
            </p>
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter email address"
                className="bg-white/10 border-white/10 focus:border-emerald-500 h-12 pr-12 rounded-xl text-white placeholder:text-emerald-100/30"
              />
              <Button size="icon" className="absolute right-1 top-1 h-10 w-10 bg-emerald-600 hover:bg-emerald-500 rounded-lg">
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Partners Area */}
        <div className="pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Using text labels as placeholders for actual logos */}
              <span className="text-xs font-black tracking-widest uppercase">MTN MoMo</span>
              <span className="text-xs font-black tracking-widest uppercase">Airtel Money</span>
              <span className="text-xs font-black tracking-widest uppercase">Zamtel Pay</span>
              <span className="text-xs font-black tracking-widest uppercase">Visa / Mastercard</span>
            </div>
            
            <div className="text-xs font-medium text-emerald-100/40">
              © {new Date().getFullYear()} Football Association of Zambia. <span className="hidden md:inline">Designed for the Fans.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};