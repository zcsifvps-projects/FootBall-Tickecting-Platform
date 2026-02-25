// backend-faz-ticket/models/Ticket.js
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // for guest checkouts
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    zone: {
      type: String,
      required: true,
      // e.g., "VIP Grandstand", "West Wing", etc.
    },
    pricePerTicket: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paypal", "mtn_mobile_money", "zamtel", "other"],
      default: null,
    },
    paymentId: {
      type: String,
      default: null, // store txn ID from payment provider
    },
    customerEmail: String,
    customerPhone: String,
    seats: {
      type: [String], // e.g., ["A1", "A2", "B5"]
      default: [],
    },
  },
  { timestamps: true }
);

// Index for quick lookups
ticketSchema.index({ matchId: 1, status: 1 });
ticketSchema.index({ userId: 1 });
ticketSchema.index({ paymentId: 1 });

// Virtual for calculating revenue
ticketSchema.virtual("revenue").get(function() {
  return this.totalPrice;
});

export default mongoose.model("Ticket", ticketSchema);
