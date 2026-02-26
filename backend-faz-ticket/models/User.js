// backend-faz-ticket/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    password: { type: String, required: true },
    googleId: { type: String }, // for Google SSO later

    // Verification / roles
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },

    // Email verification by token (link)
    verifyToken: { type: String },
    verifyExpires: { type: Date },

    // Email verification by code/OTP
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },

    // Refresh tokens (if you’re storing them)
    refreshTokens: [{ type: String }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
