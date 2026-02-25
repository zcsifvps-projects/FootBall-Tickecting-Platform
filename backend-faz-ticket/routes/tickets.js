// backend-faz-ticket/routes/tickets.js
import express from "express";
import Ticket from "../models/Ticket.js";
import Match from "../models/Match.js";
import { authenticate, requireVerified } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────
// PUBLIC ROUTES (Checkout & Ticket Purchase)
// ─────────────────────────────────────────────────────

/**
 * POST /api/tickets
 * Create a new ticket reservation (authenticated users only)
 */
router.post("/api/tickets", authenticate, requireVerified, async (req, res) => {
  try {
    const { matchId, quantity, zone, customerEmail, customerPhone, seats } = req.body;

    // Validate match exists
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ error: "Match not found" });

    // Find zone pricing
    const zoneData = match.zones.find((z) => z.name === zone);
    if (!zoneData) return res.status(400).json({ error: "Invalid zone" });

    // Validate quantity
    if (quantity > zoneData.capacity) {
      return res.status(400).json({ error: "Not enough tickets in this zone" });
    }

    const pricePerTicket = zoneData.price;
    const totalPrice = pricePerTicket * quantity;

    // Create ticket (pending payment)
    const ticket = new Ticket({
      matchId,
      quantity,
      zone,
      pricePerTicket,
      totalPrice,
      customerEmail,
      customerPhone,
      seats: seats || [], // Will be assigned after payment
      status: "pending",
    });

    await ticket.save();

    // Return ticket with payment info
    res.status(201).json({
      ticketId: ticket._id,
      message: "Ticket reserved. Proceed to payment.",
      totalPrice,
      paymentRequired: true,
    });
  } catch (err) {
    console.error("Error creating ticket:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/tickets/:matchId
 * Fetch all tickets for a match (for dashboard analytics)
 */
router.get("/api/tickets/:matchId", async (req, res) => {
  try {
    const { matchId } = req.params;

    const tickets = await Ticket.find({ matchId }).populate("userId", "email");

    const stats = {
      totalTicketsSold: tickets
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + t.quantity, 0),
      totalRevenue: tickets
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + t.totalPrice, 0),
      pendingTickets: tickets.filter((t) => t.status === "pending").length,
      cancelledTickets: tickets.filter((t) => t.status === "cancelled").length,
      tickets,
    };

    res.json(stats);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * PATCH /api/tickets/:id
 * Update ticket status (called after successful payment)
 */
router.patch("/api/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentId, paymentMethod } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status, paymentId, paymentMethod },
      { new: true }
    );

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    // Update match ticket sales count if payment completed
    if (status === "completed") {
      await Match.findByIdAndUpdate(ticket.matchId, {
        $inc: { ticketsSold: ticket.quantity },
      });
    }

    res.json({ message: "Ticket updated", ticket });
  } catch (err) {
    console.error("Error updating ticket:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/tickets/:id
 * Fetch a specific ticket by ID
 */
router.get("/api/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("matchId");
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    console.error("Error fetching ticket:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/tickets/:id
 * Cancel a ticket (refund if completed)
 */
router.delete("/api/tickets/:id", async (req, res) => {
  try {
    // Fetch ticket first before using ticket.status
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Now update with proper status logic
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: ticket.status === "completed" ? "refunded" : "cancelled" },
      { new: true }
    );

    // Decrement match sales if was completed
    if (ticket.status === "completed") {
      await Match.findByIdAndUpdate(ticket.matchId, {
        $inc: { ticketsSold: -ticket.quantity },
      });
    }

    res.json({ message: "Ticket cancelled", ticket: updatedTicket });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
