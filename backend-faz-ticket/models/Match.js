import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    homeTeam: {
      type: String,
      required: true,
      trim: true,
    },
    awayTeam: {
      type: String,
      required: true,
      trim: true,
    },
    competition: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    stadium: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    priceFrom: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "sold-out", "cancelled"],
      default: "available",
    },
    totalTickets: {
      type: Number,
      required: true,
      min: 1,
    },
    ticketsSold: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    zones: [
      {
        name: String,
        capacity: Number,
        priceModifier: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

// Auto-calculate status based on ticket availability
matchSchema.pre("save", function () {
  if (this.ticketsSold >= this.totalTickets) {
    this.status = "sold-out";
  } else if (this.status === "sold-out" && this.ticketsSold < this.totalTickets) {
    this.status = "available";
  }
});

export default mongoose.model("Match", matchSchema);
