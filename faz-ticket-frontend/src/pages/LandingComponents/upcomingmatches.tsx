// src/pages/LandingComponents/upcomingmatches.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";

type Fixture = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  date: string;
  time: string;
  stadium: string;
  city: string;
  priceFrom: number;
  category: "National Team" | "Super League" | "Cup" | "Friendly";
  status?: "limited";
};

export default function UpcomingMatches() {
  // Fetch matches from backend
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ["matches"],
    queryFn: () => api.matches.getAll(),
  });

  const [activeCategory, setActiveCategory] = useState<
    "all" | "National" | "League" | "Cup" | "Friendly"
  >("all");

  // Filter by competition type from backend
  const filteredFixtures = activeCategory === "all"
    ? matches
    : matches.filter((m: any) => {
        const competition = m.competition?.toLowerCase() || "";
        if (activeCategory === "National") return competition.includes("national") || competition.includes("qualifier");
        if (activeCategory === "League") return competition.includes("league") || competition.includes("super");
        if (activeCategory === "Cup") return competition.includes("cup");
        if (activeCategory === "Friendly") return competition.includes("friendly");
        return true;
      });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Upcoming Matches</h2>
            <p className="text-muted-foreground">Don&apos;t miss out on the action</p>
          </div>
          <Button variant="outline" size="lg">
            View All
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-5">
            <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="national" onClick={() => setActiveCategory("National")}>
              National
            </TabsTrigger>
            <TabsTrigger value="league" onClick={() => setActiveCategory("League")}>
              League
            </TabsTrigger>
            <TabsTrigger value="cup" onClick={() => setActiveCategory("Cup")}>
              Cup
            </TabsTrigger>
            <TabsTrigger value="friendly" onClick={() => setActiveCategory("Friendly")}>
              Friendly
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && <p className="text-center text-slate-500">Loading matches...</p>}

        {/* Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFixtures.length > 0 ? (
            filteredFixtures.map((match: any) => (
              <MatchCard key={match._id} match={match} />
            ))
          ) : (
            <p className="text-center text-slate-500 col-span-full">{isLoading ? "Loading..." : "No matches available in this category"}</p>
          )}
        </div>
      </div>
    </section>
  );
}
