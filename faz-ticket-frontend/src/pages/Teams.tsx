import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ShieldCheck, ArrowRight, Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// === Teams Data ===
const teams = [
  { id: 1, name: "Chipolopolo (National Team)", stadium: "Heroes National Stadium", city: "Lusaka", capacity: "60,000", founded: "1929", colors: "Green & White", achievements: "1x African Cup Winner (2012)", logo: "🇿🇲" },
  { id: 2, name: "Zesco United FC", stadium: "Levy Mwanawasa Stadium", city: "Ndola", capacity: "49,800", founded: "1974", colors: "Blue & White", achievements: "8x Super League Champions", logo: "⚡" },
  { id: 3, name: "Nkana FC", stadium: "Nkana Stadium", city: "Kitwe", capacity: "10,000", founded: "1935", colors: "Red & Black", achievements: "13x League Champions", logo: "🔴" },
  { id: 4, name: "Red Arrows FC", stadium: "Nkoloma Stadium", city: "Lusaka", capacity: "5,000", founded: "1965", colors: "Red & Green", achievements: "5x League Champions", logo: "🎯" },
  { id: 5, name: "Green Eagles FC", stadium: "Nkoloma Stadium", city: "Choma", capacity: "5,000", founded: "1986", colors: "Green & Yellow", achievements: "1x League Champions", logo: "🦅" },
  { id: 6, name: "Power Dynamos FC", stadium: "Arthur Davies Stadium", city: "Kitwe", capacity: "18,000", founded: "1971", colors: "Orange & Black", achievements: "6x League Champions", logo: "⚡" },
];

// === Stadiums Data ===
const stadiums = [
  { id: 1, name: "Heroes National Stadium", city: "Lusaka", capacity: "60,000", opened: "2014", surface: "Natural Grass", features: ["VIP Lounges", "Media Center", "Training Facilities", "Modern Lighting"], description: "Zambia's premier sports venue, hosting national team matches and major events." },
  { id: 2, name: "Levy Mwanawasa Stadium", city: "Ndola", capacity: "49,800", opened: "2012", surface: "Natural Grass", features: ["Olympic Standard Track", "VIP Boxes", "Conference Rooms"], description: "One of Africa's most modern stadiums, home to Zesco United FC." },
  { id: 3, name: "Nkana Stadium", city: "Kitwe", capacity: "10,000", opened: "1955", surface: "Natural Grass", features: ["Historic Venue", "Local Atmosphere", "Community Hub"], description: "Historic home of Nkana FC, one of Zambia's oldest football clubs." },
  { id: 4, name: "Nkoloma Stadium", city: "Lusaka", capacity: "5,000", opened: "2008", surface: "Natural Grass", features: ["Compact Design", "Great Acoustics", "Easy Access"], description: "Multi-purpose venue hosting various league matches." }
];

const Teams = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter',sans-serif]">
      <Header />

      <main className="flex-1">
        {/* Editorial Header */}
        <section className="pt-40 pb-20 border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="h-4 w-4 text-[#0e633d]" />
                <span className="text-sm font-medium uppercase tracking-widest text-slate-400">Verified FAZ Registry</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-medium tracking-tighter text-slate-900 leading-[0.95] max-w-4xl">
                <span className="text-[#0e633d]">Clubs</span> and <br />
                <span className="text-[#0e633d]">Stadiums</span> shaping <br />
                <span className="text-[#ef7d00]">Zambian football</span>
              </h1>
              <p className="text-slate-500 max-w-2xl text-lg font-light leading-relaxed">
                A structured overview of registered football clubs and official match venues,
                maintained for transparency and supporter access.
              </p>
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="container mx-auto px-4 py-24 max-w-7xl">
          <Tabs defaultValue="teams">
            <div className="flex flex-col md:flex-row items-center justify-between mb-14 gap-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Registry Explorer</h2>

              <TabsList className="bg-slate-100 p-1 rounded-full flex-shrink-0">
                <TabsTrigger
                  value="teams"
                  className="rounded-full px-8 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#0e633d] data-[state=active]:text-white transition-all"
                >
                  Clubs
                </TabsTrigger>
                <TabsTrigger
                  value="stadiums"
                  className="rounded-full px-8 py-2 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-[#0e633d] data-[state=active]:text-white transition-all"
                >
                  Stadiums
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Clubs Content */}
            <TabsContent value="teams">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teams.map(team => (
                  <Card key={team.id} className="border border-slate-100 rounded-3xl hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0e633d] transition-colors">{team.name}</h3>
                          <p className="text-[10px] font-bold text-[#ef7d00] uppercase tracking-widest">Est. {team.founded}</p>
                        </div>
                        <span className="text-4xl">
                          {team.logo}
                          </span>
                      </div>

                      <div className="flex items-center gap-2 text-[#0e633d]">
                        <Trophy size={14} />
                        <p className="text-xs font-medium uppercase tracking-tight">{team.achievements}</p>
                      </div>

                      <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} className="text-[#ef7d00]" />
                          {team.city}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={12} />
                          {team.capacity}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Stadiums Content */}
            <TabsContent value="stadiums">
              <div className="space-y-12">
                {stadiums.map(stadium => (
                  <div key={stadium.id} className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-100 rounded-[2.5rem] overflow-hidden group">
                    <div className="lg:col-span-4 bg-[#0e633d] p-12 text-white flex flex-col justify-between relative overflow-hidden">
                      <div className="z-10">
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-4">Official Venue 0{stadium.id}</p>
                        <h3 className="text-4xl font-medium tracking-tighter">{stadium.name}</h3>
                      </div>
                      <div className="z-10 pt-12">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Max Capacity</p>
                         <p className="text-5xl font-light tracking-tighter">{stadium.capacity}</p>
                      </div>
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Users size={120} strokeWidth={1} />
                      </div>
                    </div>

                    <div className="lg:col-span-8 p-12 bg-white flex flex-col justify-center">
                      <div className="flex items-center gap-4 mb-6">
                        <Badge className="bg-[#ef7d00] hover:bg-[#ef7d00] rounded-none px-4 py-1 text-[10px] uppercase font-bold tracking-widest">
                          Opened {stadium.opened}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{stadium.surface}</span>
                      </div>
                      <p className="text-slate-500 text-lg font-light leading-relaxed mb-8 max-w-2xl">{stadium.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {stadium.features.map((feature, i) => (
                          <span key={i} className="text-[9px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100 px-4 py-2 rounded-lg group-hover:border-[#0e633d]/20 transition-all">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Minimal CTA */}
        <section className="py-32 bg-slate-50 border-t border-slate-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-medium text-slate-900 mb-8 tracking-tighter">
              Witness the <span className="text-[#0e633d]">Moment.</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto mb-12 font-light text-lg">
              Secure verified tickets for upcoming fixtures directly through the official platform.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#0e633d] hover:bg-[#0a4a2e] text-white px-12 h-16 rounded-none text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl shadow-[#0e633d]/20"
            >
              <Link to="/#ToMatches">
                Browse matches
                <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Teams;