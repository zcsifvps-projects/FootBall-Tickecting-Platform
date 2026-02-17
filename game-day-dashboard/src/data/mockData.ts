import { Match, Order, DailySales } from "./types";

export const teams = [
  "Zesco United", "Power Dynamos", "Nkana FC", "Zanaco FC",
  "Green Buffaloes", "Red Arrows", "Forest Rangers", "Lusaka Dynamos",
  "Buildcon FC", "Napsa Stars", "Kabwe Warriors", "Nkwazi FC",
  "Chipolopolo", "Bafana Bafana", "Super Eagles",
];

export const venues = [
  "Heroes National Stadium, Lusaka",
  "Levy Mwanawasa Stadium, Ndola",
  "Nkana Stadium, Kitwe",
  "Woodlands Stadium, Lusaka",
  "Arthur Davies Stadium, Kitwe",
  "Nkolomma Stadium, Lusaka",
];

const createZones = (multiplier = 1): Match["zones"] => [
  { id: "vip", name: "VIP Grandstand", gate: "Gate 1", price: 500 * multiplier, totalSeats: 2000, soldSeats: Math.floor(Math.random() * 1800) },
  { id: "west", name: "West Wing", gate: "Gate 12", price: 250 * multiplier, totalSeats: 5000, soldSeats: Math.floor(Math.random() * 4500) },
  { id: "east", name: "East Wing", gate: "Gate 6", price: 200 * multiplier, totalSeats: 5000, soldSeats: Math.floor(Math.random() * 4500) },
  { id: "south", name: "South Wing", gate: "Gate 3", price: 100 * multiplier, totalSeats: 8000, soldSeats: Math.floor(Math.random() * 7000) },
  { id: "north", name: "North Wing", gate: "Gate 9", price: 150 * multiplier, totalSeats: 8000, soldSeats: Math.floor(Math.random() * 7000) },
];

export const matches: Match[] = [
  {
    id: "m1", homeTeam: "Chipolopolo", awayTeam: "Bafana Bafana",
    category: "World Cup Qualifier", date: "2026-03-15", time: "15:00",
    venue: "Heroes National Stadium, Lusaka", zones: createZones(2),
    saleStart: "2026-02-01", saleEnd: "2026-03-15",
    maxTicketsPerCustomer: 4, status: "upcoming", isFeatured: true, badge: "Limited",
  },
  {
    id: "m2", homeTeam: "Zesco United", awayTeam: "Nkana FC",
    category: "League", date: "2026-02-22", time: "15:00",
    venue: "Levy Mwanawasa Stadium, Ndola", zones: createZones(),
    saleStart: "2026-02-10", saleEnd: "2026-02-22",
    maxTicketsPerCustomer: 6, status: "upcoming", isFeatured: false,
  },
  {
    id: "m3", homeTeam: "Power Dynamos", awayTeam: "Zanaco FC",
    category: "Cup", date: "2026-02-08", time: "14:00",
    venue: "Arthur Davies Stadium, Kitwe", zones: createZones(),
    saleStart: "2026-01-25", saleEnd: "2026-02-08",
    maxTicketsPerCustomer: 5, status: "completed", isFeatured: false,
  },
  {
    id: "m4", homeTeam: "Green Buffaloes", awayTeam: "Red Arrows",
    category: "League", date: "2026-02-09", time: "15:00",
    venue: "Woodlands Stadium, Lusaka", zones: createZones(),
    saleStart: "2026-01-28", saleEnd: "2026-02-09",
    maxTicketsPerCustomer: 6, status: "live", isFeatured: true,
  },
  {
    id: "m5", homeTeam: "Chipolopolo", awayTeam: "Super Eagles",
    category: "National", date: "2026-04-10", time: "18:00",
    venue: "Heroes National Stadium, Lusaka", zones: createZones(2),
    saleStart: "2026-03-01", saleEnd: "2026-04-10",
    maxTicketsPerCustomer: 4, status: "upcoming", isFeatured: true, badge: "Limited",
  },
  {
    id: "m6", homeTeam: "Napsa Stars", awayTeam: "Buildcon FC",
    category: "Friendly", date: "2026-01-20", time: "10:00",
    venue: "Woodlands Stadium, Lusaka", zones: createZones(),
    saleStart: "2026-01-10", saleEnd: "2026-01-20",
    maxTicketsPerCustomer: 10, status: "completed", isFeatured: false,
  },
];

const buyers = [
  { name: "Mwila Chanda", phone: "0971234567" },
  { name: "Bwalya Musonda", phone: "0962345678" },
  { name: "Chilufya Mulenga", phone: "0953456789" },
  { name: "Kapasa Banda", phone: "0974567890" },
  { name: "Mutale Katongo", phone: "0965678901" },
  { name: "Nchimunya Phiri", phone: "0956789012" },
  { name: "Kasonde Lungu", phone: "0977890123" },
  { name: "Tembo Zulu", phone: "0968901234" },
];

const paymentMethods: ("MTN" | "Airtel" | "Zamtel")[] = ["MTN", "Airtel", "Zamtel"];
const orderStatuses: ("confirmed" | "pending" | "refunded")[] = ["confirmed", "confirmed", "confirmed", "pending", "refunded"];
const zoneNames = ["VIP Grandstand", "West Wing", "East Wing", "South Wing", "North Wing"];

export const orders: Order[] = Array.from({ length: 40 }, (_, i) => {
  const buyer = buyers[i % buyers.length];
  const match = matches[i % matches.length];
  const zone = zoneNames[i % zoneNames.length];
  const seats = Math.floor(Math.random() * 4) + 1;
  const zoneData = match.zones.find(z => z.name === zone);
  return {
    id: `ORD-${String(i + 1).padStart(4, "0")}`,
    matchId: match.id,
    buyerName: buyer.name,
    buyerPhone: buyer.phone,
    zone,
    seats,
    amount: (zoneData?.price ?? 100) * seats,
    paymentMethod: paymentMethods[i % 3],
    status: orderStatuses[i % orderStatuses.length],
    createdAt: new Date(2026, 1, Math.max(1, 9 - Math.floor(i / 3)), 8 + i % 12, i * 7 % 60).toISOString(),
  };
});

export const dailySales: DailySales[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(2026, 0, 11 + i);
  return {
    date: d.toISOString().split("T")[0],
    revenue: Math.floor(Math.random() * 80000) + 20000,
    tickets: Math.floor(Math.random() * 300) + 50,
  };
});

export const getMatchById = (id: string) => matches.find(m => m.id === id);
export const getOrdersForMatch = (matchId: string) => orders.filter(o => o.matchId === matchId);

export const stats = {
  totalRevenue: orders.filter(o => o.status === "confirmed").reduce((s, o) => s + o.amount, 0),
  totalTickets: orders.filter(o => o.status === "confirmed").reduce((s, o) => s + o.seats, 0),
  activeMatches: matches.filter(m => m.status === "upcoming" || m.status === "live").length,
  totalOrders: orders.length,
  revenueByZone: zoneNames.map(z => ({
    zone: z,
    revenue: orders.filter(o => o.zone === z && o.status === "confirmed").reduce((s, o) => s + o.amount, 0),
  })),
  revenueByPayment: paymentMethods.map(p => ({
    method: p,
    revenue: orders.filter(o => o.paymentMethod === p && o.status === "confirmed").reduce((s, o) => s + o.amount, 0),
  })),
};
