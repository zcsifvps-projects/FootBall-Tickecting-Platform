import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// Nodemailer transport
let transporter;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn("⚠️  SMTP credentials missing (EMAIL_USER or EMAIL_PASS). Email sending will be disabled.");
  transporter = {
    verify: async () => Promise.resolve(),
    sendMail: async () => {
      throw new Error("SMTP credentials not configured. Set EMAIL_USER and EMAIL_PASS in backend .env");
    },
  };
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // Verify SMTP connection at startup
  transporter
    .verify()
    .then(() => console.log("✅ SMTP transporter is ready"))
    .catch((err) => console.error("❌ SMTP verify failed:", err));
}

async function sendVerificationEmail(toEmail, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your FAZ verification code",
    text: `Your FAZ verification code is: ${code}. It expires in 12 hours.`,
    html: `<p>Your FAZ verification code is: <strong>${code}</strong>.</p><p>This code expires in 12 hours.</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${toEmail}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error(`❌ Failed to send verification email to ${toEmail}:`, err);
    throw err;
  }
}

// --------------------
// POST /api/auth/signup
// --------------------
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    // 1. Validate inputs
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 3. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    // Generate verification code and expiry
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.verificationCode = code;
    newUser.verificationCodeExpires = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours

    await newUser.save();

    // Send verification email (best-effort)
    try {
      await sendVerificationEmail(newUser.email, code);
    } catch (mailErr) {
      console.error("Email send failed:", mailErr);
    }

    // 5. Generate JWT
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: "Missing email or code" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({ error: "No verification code present" });
    }

    if (user.verificationCode !== String(code)) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    if (new Date() > user.verificationCodeExpires) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: "Email verified" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/resend-code
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 12 * 60 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationEmail(user.email, code);
    } catch (mailErr) {
      console.error("Resend email failed:", mailErr);
    }

    res.json({ message: "Verification code resent" });
  } catch (err) {
    console.error("Resend code error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/test-email - quick helper to test SMTP
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await sendVerificationEmail(email, code);
    res.json({ message: `Test email sent to ${email}` });
  } catch (err) {
    console.error("Test email error:", err);
    res.status(500).json({ error: err.message || "Failed to send test email" });
  }
});

export default router;
