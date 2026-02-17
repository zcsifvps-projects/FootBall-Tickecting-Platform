import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// ========================
// PUBLIC ROUTES (Get Matches)
// ========================

// Get all matches (public)
router.get("/api/matches", async (req, res) => {
  try {
    const { status, competition } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (competition) filter.competition = competition;

    const matches = await Match.find(filter).sort({ date: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single match by ID
router.get("/api/matches/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }
    res.json(match);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========================
// ADMIN ROUTES (CRUD Operations)
// ========================

// Create a new match (admin only)
router.post("/api/admin/matches", async (req, res) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const {
      homeTeam,
      awayTeam,
      competition,
      date,
      time,
      stadium,
      city,
      priceFrom,
      totalTickets,
      description,
      imageUrl,
      zones,
    } = req.body;

    // Validation
    if (
      !homeTeam ||
      !awayTeam ||
      !competition ||
      !date ||
      !time ||
      !stadium ||
      !city ||
      !priceFrom ||
      !totalTickets
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMatch = new Match({
      homeTeam,
      awayTeam,
      competition,
      date,
      time,
      stadium,
      city,
      priceFrom,
      totalTickets,
      description,
      imageUrl,
      zones,
      status: "available",
    });

    await newMatch.save();
    res.status(201).json(newMatch);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a match (admin only)
router.put("/api/admin/matches/:id", async (req, res) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a match (admin only)
router.delete("/api/admin/matches/:id", async (req, res) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    res.json({ message: "Match deleted successfully", match });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all matches for admin panel
router.get("/api/admin/matches", async (req, res) => {
  try {
    // TODO: Add authentication middleware to verify admin
    const matches = await Match.find().sort({ date: 1 });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket sales count (when order is placed)
router.patch("/api/matches/:id/tickets", async (req, res) => {
  try {
    const { quantity } = req.body;

    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    const newSold = match.ticketsSold + quantity;
    if (newSold > match.totalTickets) {
      return res.status(400).json({ error: "Not enough tickets available" });
    }

    match.ticketsSold = newSold;
    await match.save();

    res.json(match);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
