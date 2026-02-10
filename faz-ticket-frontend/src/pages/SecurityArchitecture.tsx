// SecurityArchitecture.tsx
import { Lock, QrCode, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout/Header"; 
import { Footer } from "@/components/layout/Footer";

export default function SecurityArchitecture() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-slate-50/50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 pt-10">
              <h2 className="text-3xl font-black uppercase italic text-[#0e633d] mb-4">
                Security Architecture
              </h2>
              <p className="text-slate-500">
                We utilize multi-layered security protocols to protect your transactions
                and guarantee stadium access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-3">256-Bit Encryption</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Every transaction is processed through a bank-grade secure layer,
                  ensuring your mobile money details never fall into the wrong hands.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-[#0e633d] rounded-xl flex items-center justify-center mb-6">
                  <QrCode className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-3">Single-Use QR</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Our tickets feature encrypted QR codes that are invalidated
                  the moment they are scanned at the gate.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold mb-3">Real-time Validation</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Stadium gates are synced to our central server in real-time,
                  preventing the use of revoked or blacklisted tickets.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}