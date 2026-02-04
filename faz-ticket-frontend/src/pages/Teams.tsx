import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Trophy, Calendar, ArrowRight, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const teams = [

  {

    id: 1,

    name: "Chipolopolo (National Team)",

    stadium: "Heroes National Stadium",

    city: "Lusaka",

    capacity: "60,000",

    founded: "1929",

    colors: "Green & White",

    achievements: "1x African Cup Winner (2012)",

    logo: "🇿🇲"

  },

  {

    id: 2,

    name: "Zesco United FC",

    stadium: "Levy Mwanawasa Stadium",

    city: "Ndola",

    capacity: "49,800",

    founded: "1974",

    colors: "Blue & White",

    achievements: "8x Super League Champions",

    logo: "⚡"

  },

  {

    id: 3,

    name: "Nkana FC",

    stadium: "Nkana Stadium",

    city: "Kitwe",

    capacity: "10,000",

    founded: "1935",

    colors: "Red & Black",

    achievements: "13x League Champions",

    logo: "🔴"

  },

  {

    id: 4,

    name: "Red Arrows FC",

    stadium: "Nkoloma Stadium",

    city: "Lusaka",

    capacity: "5,000",

    founded: "1965",

    colors: "Red & Green",

    achievements: "5x League Champions",

    logo: "🎯"

  },

  {

    id: 5,

    name: "Green Eagles FC",

    stadium: "Nkoloma Stadium",

    city: "Choma",

    capacity: "5,000",

    founded: "1986",

    colors: "Green & Yellow",

    achievements: "1x League Champions",

    logo: "🦅"

  },

  {

    id: 6,

    name: "Power Dynamos FC",

    stadium: "Arthur Davies Stadium",

    city: "Kitwe",

    capacity: "18,000",

    founded: "1971",

    colors: "Orange & Black",

    achievements: "6x League Champions",

    logo: "⚡"

  }

];



const stadiums = [

  {

    id: 1,

    name: "Heroes National Stadium",

    city: "Lusaka",

    capacity: "60,000",

    opened: "2014",

    surface: "Natural Grass",

    features: ["VIP Lounges", "Media Center", "Training Facilities", "Modern Lighting"],

    description: "Zambia's premier sports venue, hosting national team matches and major events."

  },

  {

    id: 2,

    name: "Levy Mwanawasa Stadium",

    city: "Ndola",

    capacity: "49,800",

    opened: "2012",

    surface: "Natural Grass",

    features: ["Olympic Standard Track", "VIP Boxes", "Conference Rooms"],

    description: "One of Africa's most modern stadiums, home to Zesco United FC."

  },

  {

    id: 3,

    name: "Nkana Stadium",

    city: "Kitwe",

    capacity: "10,000",

    opened: "1955",

    surface: "Natural Grass",

    features: ["Historic Venue", "Local Atmosphere", "Community Hub"],

    description: "Historic home of Nkana FC, one of Zambia's oldest football clubs."

  },

  {

    id: 4,

    name: "Nkoloma Stadium",

    city: "Lusaka",

    capacity: "5,000",

    opened: "2008",

    surface: "Natural Grass",

    features: ["Compact Design", "Great Acoustics", "Easy Access"],

    description: "Multi-purpose venue hosting various league matches."

  }

];



const Teams = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-['Inter',sans-serif]">
      <Header />
      
      <main className="flex-1">
        {/* Dynamic Editorial Hero */}
        <section className="relative pt-32 pb-20 px-4 border-b border-slate-100">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-[#0e633d] mb-6">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase">Verified FAZ Registry</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                  THE <span className="text-[#0e633d]">CLUBS</span> <br />& CATHEDRALS.
                </h1>
              </div>
              <div className="md:text-right max-w-xs">
                <p className="text-slate-500 leading-relaxed font-medium border-l-2 md:border-l-0 md:border-r-2 border-[#0e633d] px-6 py-2">
                  A definitive guide to the institutions and iconic venues defining the Zambian football era.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation & Content */}
        <section className="container mx-auto px-4 py-20 max-w-7xl">
          <Tabs defaultValue="teams" className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-slate-100 pb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Database Explorer</h2>
              <TabsList className="bg-slate-50 border border-slate-200 p-1 rounded-full h-auto">
                <TabsTrigger 
                  value="teams" 
                  className="px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider data-[state=active]:bg-[#0e633d] data-[state=active]:text-white"
                >
                  Active Clubs
                </TabsTrigger>
                <TabsTrigger 
                  value="stadiums" 
                  className="px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider data-[state=active]:bg-[#0e633d] data-[state=active]:text-white"
                >
                  Regional Stadiums
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Teams Tab - "The Grid" */}
            <TabsContent value="teams" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                {teams.map((team) => (
                  <div key={team.id} className="group cursor-default">
                    <div className="relative aspect-[4/3] bg-slate-50 rounded-3xl mb-6 overflow-hidden flex items-center justify-center border border-slate-100 group-hover:border-[#0e633d]/20 transition-all">
                      <div className="text-7xl group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">
                        {team.logo}
                      </div>
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="icon" className="rounded-full bg-white border-none shadow-xl">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">{team.name}</h3>
                        <span className="text-xs font-bold text-slate-300">EST. {team.founded}</span>
                      </div>
                      <p className="text-[#0e633d] text-xs font-bold tracking-widest uppercase">{team.colors}</p>
                      <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase">{team.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span className="text-xs font-bold uppercase">{team.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Stadiums Tab - "The Architecture" */}
            <TabsContent value="stadiums" className="outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="space-y-12">
                {stadiums.map((stadium) => (
                  <div key={stadium.id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                    <div className="lg:col-span-4 aspect-video lg:aspect-square bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center text-white relative overflow-hidden p-8">
                       <div className="absolute top-0 left-0 w-full h-full bg-[#0e633d] opacity-10" />
                       <Users className="h-10 w-10 text-[#0e633d] mb-4" />
                       <span className="text-6xl font-black tracking-tighter">{stadium.capacity}</span>
                       <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mt-2">Maximum Capacity</span>
                    </div>
                    <div className="lg:col-span-8 px-4 lg:px-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-[#0e633d] hover:bg-[#0e633d] rounded-full px-4 text-[10px] font-bold tracking-widest uppercase">
                          Opened {stadium.opened}
                        </Badge>
                        <span className="text-slate-300 text-xs font-bold uppercase tracking-widest">{stadium.surface}</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 group-hover:text-[#0e633d] transition-colors">
                        {stadium.name}
                      </h3>
                      <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-2xl">
                        {stadium.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {stadium.features.map((feature, i) => (
                          <span key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-4 py-2 rounded-lg">
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

        {/* Minimal High-Impact CTA */}
        <section className="py-32 bg-slate-50 border-y border-slate-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-12">
              WITNESS THE <span className="text-[#0e633d]">LEGACY</span>.
            </h2>
            <Button size="lg" className="bg-[#0e633d] hover:bg-[#0a4a2e] text-white px-12 h-16 rounded-2xl text-sm font-black uppercase tracking-widest transition-all">
              Secure Your Match Pass <ArrowRight className="ml-4 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Teams;