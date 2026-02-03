// src/pages/Landing.tsx
import { useState } from "react";
import { Shield, CreditCard, Ticket, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-stadium.jpg";

// NEW: import the extracted component
import UpcomingMatches from "@/pages/LandingComponents/upcomingmatches";

export default function Landing() {
  const [/* searchQuery */, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section (Screenshot-style) */}
        <section
          className="relative min-h-[560px] md:min-h-[700px] overflow-hidden"
          aria-label="Ticketing hero"
        >
          {/* Background image - Updated to Levy Stadium URL */}
          <div
            className="absolute inset-0 bg-bottom bg-cover bg-no-repeat"
            style={{ 
              backgroundImage: `url('https://res.cloudinary.com/dceqpo559/image/upload/v1769605728/levy_stadium_mgegvc.webp')` 
            }}
          />
          
          {/* Green overlay - reduced opacity slightly to let the stadium show through better */}
          <div className="absolute inset-0 bg-[#0e633d]/85 md:bg-[#0e633d]/80" />
          
          {/* Subtle vignette so text pops */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center pt-20 md:pt-32 pb-24">
              
              {/* Left: copy + CTAs */}
              <div className="text-white relative z-20">
              <h1 className="text-4xl md:text-6xl font-black leading-tight uppercase italic tracking-tighter drop-shadow-md">
              Experience Football <br className="hidden md:block" />
              Like Never Before
            </h1>

            <p className="mt-6 text-lg md:text-xl text-white font-bold max-w-xl drop-shadow-sm">
            Secure your seat for Zambia&apos;s biggest matches with instant QR tickets.
            </p>

              <div className="mt-8 flex flex-wrap gap-4">
           {/* Primary Button: Solid Orange */}
              <Button 
                 size="lg" 
                className="h-14 px-8 font-black uppercase italic bg-orange-600 text-white hover:bg-orange-700 shadow-lg border-none"
            >
              Buy Tickets Now
             </Button>

          {/* Secondary Button: Fixed Visibility */}
            <Button 
              size="lg" 
              variant="outline"
                className="h-14 px-8 font-black uppercase italic border-2 border-orange-500 bg-black/20 text-orange-500 hover:bg-orange-500 hover:text-white transition-all backdrop-blur-sm"
              >
              View Matches
            </Button>
           </div>
              </div>
              {/* Right: featured match card */}
              <div className="relative hidden md:block">
                <div className="mx-auto w-[92%] md:w-[480px] rotate-2">
                  <div className="rounded-[2rem] bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
                    <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 text-[#0e633d] font-black uppercase italic text-xs tracking-widest border-b">
                      <span className="inline-block h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                      Featured Match
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic">
                        Zambia <span className="text-[#0e633d]">vs</span> Ghana
                      </h3>
                      <p className="mt-1 text-sm font-bold text-slate-400 uppercase tracking-wide">National Heroes Stadium</p>

                      <div className="mt-6 grid grid-cols-3 gap-4 border-y border-slate-100 py-4">
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Date</div>
                          <div className="font-bold text-slate-900 text-sm">Dec 15, 2024</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400">Kick-off</div>
                          <div className="font-bold text-slate-900 text-sm">16:00 CAT</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-black uppercase text-slate-400">From</div>
                          <div className="font-black text-[#0e633d] text-lg">K120</div>
                        </div>
                      </div>

                      <Button className="mt-6 w-full h-12 text-base font-black uppercase italic bg-[#0e633d] hover:bg-black text-white rounded-xl">
                        Choose Seats
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
<section className="py-12 bg-white border-b border-slate-100">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      
      {/* 100% Secure */}
      <div className="flex items-start gap-5 group">
        <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
          <Shield className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-black uppercase italic text-sm tracking-wider text-slate-900">100% Secure</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Every transaction is encrypted and verified by industry standards.
          </p>
        </div>
      </div>

      {/* Easy Payments */}
      <div className="flex items-start gap-5 group border-y md:border-y-0 md:border-x border-slate-100 py-8 md:py-0 md:px-12">
        <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
          <CreditCard className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-black uppercase italic text-sm tracking-wider text-slate-900">Easy Payments</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Pay instantly using MoMo (MTN, Airtel, Zamtel) or your Visa card.
          </p>
        </div>
      </div>

      {/* Instant Tickets */}
      <div className="flex items-start gap-5 group">
        <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
          <Ticket className="h-7 w-7" />
        </div>
        <div>
          <h3 className="font-black uppercase italic text-sm tracking-wider text-slate-900">Instant Tickets</h3>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Receive your digital QR ticket via SMS and Email immediately.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
        {/* Upcoming Matches Component */}
        <section className="py-20 bg-slate-50/50">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Live Ticketing</span>
        </div>
        <h2 className="text-4xl font-black uppercase italic text-slate-900 leading-none">
          Upcoming <span className="text-[#0e633d]">Fixtures</span>
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight hidden md:block">
          Filter by Competition
        </p>
        {/* You could add a small filter dropdown here later */}
        <Button variant="outline" className="rounded-full border-slate-200 font-bold uppercase text-xs px-6">
          View All Schedule
        </Button>
      </div>
    </div>

    {/* This is where your <UpcomingMatches /> component or list would render */}
    <div className="rounded-[3rem] overflow-hidden border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
       <UpcomingMatches />
    </div>
  </div>
</section>

        {/* How It Works */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How to Buy Tickets</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your tickets in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-3xl font-bold">1</div>
                <h3 className="text-xl font-bold mb-2">Register & Sign In</h3>
                <p className="text-muted-foreground">Create your account and complete your profile for fast checkout</p>
              </div>
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-3xl font-bold">2</div>
                <h3 className="text-xl font-bold mb-2">Choose Your Seats</h3>
                <p className="text-muted-foreground">Select your preferred seats from our interactive stadium map</p>
              </div>
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-3xl font-bold">3</div>
                <h3 className="text-xl font-bold mb-2">Pay & Get Tickets</h3>
                <p className="text-muted-foreground">Secure payment via Mobile Money or Card. Instant ticket delivery</p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button variant="hero" size="lg">
                Start Buying Tickets
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Safety & Anti-Fraud */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-success/10 to-primary/5 rounded-2xl p-8 border-2 border-success/20">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">Your Safety is Our Priority</h3>
                  <p className="text-muted-foreground mb-4">
                    All tickets are verified and secured with unique QR codes. Our anti-fraud system
                    ensures every ticket is genuine and can only be scanned once at the gate.
                  </p>
                  <Button variant="outline">
                    Learn About Our Security
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}