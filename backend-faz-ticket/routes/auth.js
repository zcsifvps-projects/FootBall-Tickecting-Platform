import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecretkey";
const JWT_EXPIRE = "15m";
const REFRESH_EXPIRE = "7d";

// Nodemailer transport
let transporter;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️ SMTP credentials missing. Email sending disabled.");
  transporter = {
    verify: async () => Promise.resolve(),
    sendMail: async () => Promise.resolve(),
  };
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  });

  transporter.verify()
    .then(() => console.log("✅ SMTP transporter ready"))
    .catch(err => console.error("❌ SMTP verify failed:", err));
}

async function sendVerificationEmail(toEmail, { code, url }) {
  const subject = "Verify your FAZ account";

  const textLines = [
    code ? `Your verification code is: ${code}` : null,
    url ? `Or click to verify: ${url}` : null,
  ].filter(Boolean);

  const htmlParts = [
    code ? `<p>Your verification code is: <strong>${code}</strong></p>` : "",
    url ? `<p>Or click: <a href="${url}">${url}</a></p>` : "",
  ].join("");

  await transporter.sendMail({
    from: EMAIL_USER,
    to: toEmail,
    subject,
    text: textLines.join("\n"),
    html: htmlParts,
  });
}

// Shared register/signup handler
async function handleRegister(req, res) {
  try {
    const { firstName, lastName, email, mobile, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      password,
      isVerified: false,
    });

    // Generate verification code + token
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 12 * 60 * 60 * 1000);

    const verifyToken = crypto.randomBytes(32).toString("hex");
    user.verifyToken = verifyToken;
    user.verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.save();

    const backendBase = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${backendBase}/api/auth/verify-email?email=${encodeURIComponent(user.email)}&token=${verifyToken}`;

    try {
      await sendVerificationEmail(user.email, { code, url });
    } catch (err) {
      console.error("Email send failed:", err);
    }

    return res.status(201).json({
      message: "Registration successful. Check your email to verify your account.",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
}

router.post("/register", handleRegister);
router.post("/signup", handleRegister);

router.post("/verify", async (req, res) => {
  try {
    const { email, token, code } = req.body;

    if (!email || (!token && !code)) {
      return res.status(400).json({ error: "Email and verification token/code required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const now = new Date();

    if (token) {
      if (user.verifyToken !== token || !user.verifyExpires || user.verifyExpires < now) {
        return res.status(400).json({ error: "Invalid or expired verification token" });
      }
    }

    if (code) {
      if (
        user.verificationCode !== code ||
        !user.verificationCodeExpires ||
        user.verificationCodeExpires < now
      ) {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyExpires = undefined;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

router.get("/verify-email", async (req, res) => {
  try {
    const { email, token } = req.query;
    if (!email || !token) return res.status(400).send("Missing email or token");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const now = new Date();
    if (user.verifyToken !== token || !user.verifyExpires || user.verifyExpires < now) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyExpires = undefined;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    await user.save();

    res.send("Email verified successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Verification failed");
  }
});

export default router;
