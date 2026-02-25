import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendVerificationEmail } from "../config/email.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecretkey";
const JWT_EXPIRE = "15m";
const REFRESH_EXPIRE = "7d";

// ─────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, confirmPassword } = req.body;

    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user (password hashed by pre-save hook)
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password,
      isVerified: false,
    });

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.save();

    // Send verification email
    try {
      // Build backend verification URL so the link calls our API verify endpoint
      const backendBase = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      const verificationUrl = `${backendBase}/api/auth/verify-email?email=${encodeURIComponent(
        user.email
      )}&token=${encodeURIComponent(verifyToken)}`;

      await sendVerificationEmail(user.email, verificationUrl);
      console.log(`✅ Verification email sent to ${user.email}`);
    } catch (emailErr) {
      console.error("⚠️ Email send failed:", emailErr.message);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      message: "Registration successful. Check your email to verify your account.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/verify
// ─────────────────────────────────────────────────────
router.post("/verify", async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ error: "Email and verification token required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check token validity and expiry
    if (user.verifyToken !== token || !user.verifyExpires || user.verifyExpires < new Date()) {
      return res.status(400).json({ error: "Invalid or expired verification token" });
    }

    // Mark as verified
    user.isVerified = true;
    user.verifyToken = null;
    user.verifyExpires = null;
    await user.save();

    res.json({
      message: "Email verified successfully. You can now sign in.",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/resend-verify
// ─────────────────────────────────────────────────────
router.post("/resend-verify", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Generate new token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    // Resend email
    try {
      const backendBase = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
      const verificationUrl = `${backendBase}/api/auth/verify-email?email=${encodeURIComponent(
        user.email
      )}&token=${encodeURIComponent(verifyToken)}`;

      await sendVerificationEmail(user.email, verificationUrl);
      console.log(`✅ Verification email resent to ${user.email}`);
    } catch (emailErr) {
      console.error("⚠️ Email resend failed:", emailErr.message);
    }

    res.json({ message: "Verification email resent. Check your inbox." });
  } catch (err) {
    console.error("Resend verify error:", err);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        email: user.email,
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, isVerified: user.isVerified },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRE }
    );

    // Store refresh token
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Set refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/refresh
// ─────────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    // Check if token is stored in user doc
    const user = await User.findById(decoded.id);
    if (!user || !user.refreshTokens.includes(refreshToken)) {
      return res.status(401).json({ error: "Refresh token not found" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin, isVerified: user.isVerified },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ error: "Token refresh failed" });
  }
});

// ─────────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────────
router.post("/logout", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    const userId = req.body.userId;

    if (userId && refreshToken) {
      // Remove token from user's stored tokens
      await User.findByIdAndUpdate(userId, {
        $pull: { refreshTokens: refreshToken },
      });
    }

    // Clear cookie
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

// Backward compatibility redirect
router.post("/signup", async (req, res) => {
  res.status(300).json({ message: "Use /register endpoint instead", redirect: "/register" });
});

// GET /api/auth/verify-email?email=...&token=...
router.get("/verify-email", async (req, res) => {
  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).send("Missing email or token");
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    if (user.verifyToken !== token || !user.verifyExpires || user.verifyExpires < new Date()) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verifyToken = null;
    user.verifyExpires = null;
    await user.save();

    // Prefer the dev frontend URL when not in production so local verification
    // redirects to the running Vite server (usually on 5173). Fall back to
    // FRONTEND_URL or localhost:5173 if not set.
    const frontend =
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : process.env.FRONTEND_URL_DEV || process.env.FRONTEND_URL || 'http://localhost:5173';

    return res.redirect(`${frontend}/verify-success`);
  } catch (err) {
    console.error("❌ Verify email error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;
