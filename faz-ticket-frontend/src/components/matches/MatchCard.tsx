import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  match: {
    _id?: string;
    id?: string;
    homeTeam?: string;
    awayTeam?: string;
    competition?: string;
    date?: string;
    time?: string;
    stadium?: string;
    city?: string;
    priceFrom?: number;
    status?: "available" | "limited" | "sold-out";
    ticketsSold?: number;
    totalTickets?: number;
  };
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const {
    _id,
    id,
    homeTeam = "TBD",
    awayTeam = "TBD",
    competition = "Unknown",
    date = "TBA",
    time = "TBA",
    stadium = "TBA",
    city = "TBA",
    priceFrom = 0,
    ticketsSold = 0,
    totalTickets = 1,
  } = match || {};

  const matchId = _id || id || "";
  const isSoldOut = ticketsSold >= totalTickets;
  const status = isSoldOut ? "sold-out" : "available";
  const statusConfig = {
    available: { badge: null, disabled: false },
    limited: { badge: <Badge variant="warning" className="bg-warning text-warning-foreground">Limited</Badge>, disabled: false },
    "sold-out": { badge: <Badge variant="destructive">Sold Out</Badge>, disabled: true },
  };

  const config = statusConfig[status];

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 bg-gradient-to-br from-card to-secondary/30 relative">
          {/* Competition Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="font-semibold">
              {competition}
            </Badge>
          </div>
          
          {/* Status Badge */}
          {config.badge && (
            <div className="absolute top-3 left-3">
              {config.badge}
            </div>
          )}

          {/* Teams */}
          <div className="mt-6 mb-6">
            <div className="flex items-center justify-between gap-4">
              {/* Home Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {homeTeam.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-sm">{homeTeam}</p>
              </div>

              {/* VS */}
              <div className="text-muted-foreground font-bold text-lg">VS</div>

              {/* Away Team */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">
                    {awayTeam.substring(0, 3).toUpperCase()}
                  </span>
                </div>
                <p className="font-bold text-sm">{awayTeam}</p>
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{stadium}, {city}</span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-card border-t flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">From</p>
            <p className="text-xl font-bold text-primary">ZMW {priceFrom.toFixed(2)}</p>
          </div>
          <Button
            variant={config.disabled ? "outline" : "hero"}
            disabled={config.disabled}
            asChild={!config.disabled}
          >
            {config.disabled ? (
              <span>Sold Out</span>
            ) : (
              <Link to={`/match/${matchId}`}>View & Select Seats</Link>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
