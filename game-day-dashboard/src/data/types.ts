export type MatchCategory = "National" | "League" | "Cup" | "Friendly" | "World Cup Qualifier";
export type MatchStatus = "upcoming" | "live" | "completed" | "cancelled";
export type PaymentMethod = "MTN" | "Airtel" | "Zamtel";
export type OrderStatus = "confirmed" | "pending" | "refunded" | "cancelled";

export interface StadiumZone {
  id: string;
  name: string;
  gate: string;
  price: number;
  totalSeats: number;
  soldSeats: number;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  category: MatchCategory;
  date: string;
  time: string;
  venue: string;
  zones: StadiumZone[];
  saleStart: string;
  saleEnd: string;
  maxTicketsPerCustomer: number;
  status: MatchStatus;
  isFeatured: boolean;
  badge?: string;
}

export interface Order {
  id: string;
  matchId: string;
  buyerName: string;
  buyerPhone: string;
  zone: string;
  seats: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface DailySales {
  date: string;
  revenue: number;
  tickets: number;
}
