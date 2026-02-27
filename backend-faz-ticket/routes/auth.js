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

// ========================
// LOGIN ENDPOINT
// ========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: "Please verify your email before logging in",
        email: user.email 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRE }
    );

    return res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ========================
// FORGOT PASSWORD ENDPOINT
// ========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists (security)
      return res.json({ 
        message: "If email exists, reset link has been sent" 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await user.save();

    // Send reset email
    const backendBase = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendBase}/auth/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    try {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: email,
        subject: "FAZ Ticketing - Reset Your Password",
        html: `
          <p>You requested to reset your password.</p>
          <p>Click the link below to reset your password (link expires in 1 hour):</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return res.json({ 
      message: "If email exists, reset link has been sent" 
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// ========================
// RESET PASSWORD ENDPOINT
// ========================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({ error: "Email, token, and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = new Date();
    if (user.resetToken !== token || !user.resetTokenExpires || user.resetTokenExpires < now) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

export default router;
