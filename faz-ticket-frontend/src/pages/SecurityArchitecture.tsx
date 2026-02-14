// SecurityArchitecture.tsx
import { Lock, QrCode, RefreshCw, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/Header"; 
import { Footer } from "@/components/layout/Footer";

export default function SecurityArchitecture() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      <Header />
      
      <main className="flex-1">
        {/* SPORTY HERO SECTION */}
        <section className="py-24 bg-[#0e633d] relative overflow-hidden">
          {/* Subtle Angled Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)' , backgroundSize: '40px 40px' }} />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-orange-400 mb-4">
                <ShieldCheck size={20} strokeWidth={3} />
                <span className="text-sm font-black uppercase tracking-[0.3em]">Pro-Grade Security</span>
              </div>
              <h1 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                Locked Down. <br/>
                <span className="text-orange-500">Field Ready.</span>
              </h1>
              <p className="text-green-50/80 text-lg max-w-xl font-medium border-l-4 border-orange-500 pl-6">
                Our architecture is built for the roar of the stadium. We use elite-level encryption to ensure your seat is yours, and your data stays off the field.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Feature 1 - Impact Card */}
              <div className="group relative bg-white border-2 border-slate-200 p-8 hover:border-[#0e633d] transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center group-hover:bg-[#0e633d] group-hover:text-white transition-colors">
                  <Lock size={28} />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">
                    Ironclad Pay
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    256-bit bank-grade encryption. Your mobile money transactions are shielded by the same tech used by global financial giants.
                  </p>
                </div>
                <div className="mt-8 h-1 w-full bg-slate-100 overflow-hidden">
                   <div className="h-full w-1/3 bg-orange-500 group-hover:w-full transition-all duration-500" />
                </div>
              </div>

              {/* Feature 2 - Impact Card */}
              <div className="group relative bg-white border-2 border-slate-200 p-8 hover:border-[#0e633d] transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center group-hover:bg-[#0e633d] group-hover:text-white transition-colors">
                  <QrCode size={28} />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">
                    One Scan Policy
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Dynamic QR tech makes ticket duplication impossible. Once you're in, the code is dead. Zero fraud. Zero exceptions.
                  </p>
                </div>
                <div className="mt-8 h-1 w-full bg-slate-100 overflow-hidden">
                   <div className="h-full w-1/3 bg-[#0e633d] group-hover:w-full transition-all duration-500" />
                </div>
              </div>

              {/* Feature 3 - Impact Card */}
              <div className="group relative bg-white border-2 border-slate-200 p-8 hover:border-[#0e633d] transition-all duration-300">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 flex items-center justify-center group-hover:bg-[#0e633d] group-hover:text-white transition-colors">
                  <RefreshCw size={28} />
                </div>
                <div className="mt-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-4">
                    Live Sync
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    Every gate at the stadium is hard-wired to our servers. Real-time validation ensures only legitimate fans hit the stands.
                  </p>
                </div>
                <div className="mt-8 h-1 w-full bg-slate-100 overflow-hidden">
                   <div className="h-full w-1/3 bg-blue-500 group-hover:w-full transition-all duration-500" />
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