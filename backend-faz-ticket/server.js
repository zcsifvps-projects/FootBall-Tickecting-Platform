// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js"; // make sure this exists

// ----------------------
// Load environment variables
// ----------------------
dotenv.config();

// ----------------------
// Create Express app
// ----------------------
const app = express();

// ----------------------
// MongoDB Connection
// ----------------------
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("MONGO_URI missing in .env");

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
// Middleware & Security
// ----------------------
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
if (process.env.NODE_ENV === "production") {
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
}
app.set("trust proxy", 1);

// ----------------------
// CORS
// ----------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",  // Add this
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ----------------------
// Parsers
// ----------------------
app.use(express.json({ limit: "200kb" }));
app.use(cookieParser());

// ----------------------
// Rate Limiter (Public Routes)
// ----------------------
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(["/api/frontend", "/api/public"], publicLimiter);

// ----------------------
// Debug Logging
// ----------------------
app.use((req, _res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRouter); // ✅ Auth routes

// Health check
app.get("/health", (_req, res) => res.send("ok"));

// ----------------------
// Error handler
// ----------------------
app.use((err, _req, res, _next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "❌ File too large. Max size is 30MB per file." });
  }
  console.error("❌ Error:", err?.message || err);
  res.status(500).json({ status: "error", message: "Something went wrong" });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));