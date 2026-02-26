// server.js
import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import authRouter from "./routes/auth.js";
import matchesRouter from "./routes/matches.js";
import ticketsRouter from "./routes/tickets.js";
import { authenticate, requireAdmin, requireVerified } from "./middleware/auth.js";

// ----------------------
// Optional safe env debug (does NOT print secrets)
// ----------------------
const mask = (v) => (v ? v.toString().slice(0, 2) + "***" + v.toString().slice(-2) : "(not set)");
console.log("ENV DEBUG: EMAIL_USER=", mask(process.env.EMAIL_USER), " EMAIL_PASS present=", !!process.env.EMAIL_PASS);

const app = express();

// ----------------------
// MongoDB Connection
// ----------------------
// Accept either legacy `MONGO_URI` or the scripts-friendly `MONGODB_URI`.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!MONGO_URI) throw new Error("MONGO_URI or MONGODB_URI missing in .env");

mongoose
  .connect(MONGO_URI)
  .then((conn) => {
    console.log("✅ MongoDB Connected");
    console.log(`📂 Using Database: ${conn.connection.db.databaseName}`);
  })
  .catch((err) => {
    console.error("❌ Connection Error:", err);
    process.exit(1);
  });

// ----------------------
// Middleware
// ----------------------
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_DEV,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

console.log("✅ Allowed CORS origins:", allowedOrigins);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);

      try {
        if (origin.startsWith("http://localhost:517")) return cb(null, true);
      } catch (e) {}

      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(["/api/frontend", "/api/public"], publicLimiter);

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRouter);
app.use("/api/matches", matchesRouter);
app.use("/api/tickets", ticketsRouter);

app.get("/health", (_req, res) => res.send("ok"));

// ----------------------
// Error handler
// ----------------------
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err?.message || err);
  res.status(500).json({ status: "error", message: "Something went wrong" });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
