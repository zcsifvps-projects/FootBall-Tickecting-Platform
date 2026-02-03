/**
 * Base selection data captured during the seat selection process.
 */
export interface TicketSelection {
  matchId: string;
  matchName: string;
  date: string;
  stadium: string;
  zone: string;      // E.g., "VIP Central"
  gate: string;      // E.g., "Gate 1"
  row: string;       // E.g., "10"
  seats: string[];   // E.g., ["12", "13"]
  price: number;     // Price per seat (ZMW)
}

/**
 * Extends TicketSelection to include cart-specific logic like quantity.
 */
export interface CartItem extends TicketSelection {
  quantity: number;  // Total number of seats selected
}

/**
 * Interface for the final purchased ticket stored in user profile
 */
export interface PurchasedTicket extends CartItem {
  orderId: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'cancelled';
  qrCode: string;
}