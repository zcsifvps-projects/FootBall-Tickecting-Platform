

# FAZ Ticketing — Admin Dashboard

An admin dashboard built into the existing ticketing platform, using mock data initially, with a sidebar layout for navigation.

---

## 1. Admin Layout & Navigation
A dedicated `/admin` section with a sidebar containing links to: Dashboard, Matches, Tickets/Orders, and Settings. The sidebar uses icons and collapses on smaller screens. A top header shows the admin's name and a link back to the public site.

---

## 2. Dashboard Overview (Home)
The main admin landing page showing key stat cards at a glance:
- **Total Revenue** (ZMW)
- **Total Tickets Sold**
- **Active Matches** (upcoming/live)
- **Recent Orders** count

Below the stats:
- **Revenue over time** line chart (daily/weekly trend)
- **Sales by zone** bar chart (VIP, West Wing, East Wing, etc.)
- **Payment method breakdown** pie chart (MTN, Airtel, Zamtel)
- **Recent orders** table showing last 10 orders with match, buyer, amount, status

---

## 3. Match Management
A full match management section where admins can:
- **View all matches** in a searchable/filterable table (by status, category, date)
- **Create a new match** with a form including:
  - Home team & Away team selection
  - Match category (National, League, Cup, Friendly, World Cup Qualifier)
  - Date, time, and venue/stadium
  - Stadium zone configuration — add zones (VIP Grandstand, West Wing, etc.) each with gate number, price, total seats
  - Ticket sale window (start/end date-time)
  - Max tickets per customer
  - Match badges (e.g., "Limited", featured flag)
- **Edit or cancel** existing matches
- **View per-match ticket sales** with seat availability breakdown by zone

---

## 4. Tickets & Orders
- **Orders list** — searchable table of all orders with filters (match, status, date range, payment method)
- **Order details** — view individual order info: buyer, match, zone, seats, amount, payment status
- **Seat availability view** — per-match visual showing how many seats remain in each zone
- **Refund tracking** — flag and track refunded orders

---

## 5. Sales Analytics
A dedicated analytics page with:
- Date range picker for filtering
- Revenue trend chart over time
- Tickets sold per match comparison
- Top-selling matches ranking
- Sales breakdown by zone and by payment method
- Daily sales trend

---

## 6. Mock Data
All pages will use realistic hardcoded mock data matching the platform context (Zambian football matches, ZMW currency, local stadiums, mobile money providers). This makes it easy to swap in a real backend later.

