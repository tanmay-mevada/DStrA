import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "student"], default: "student" },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  lastSeen: { type: Date, default: Date.now },
  pageVisits: [
    {
      path: String,
      visitedAt: { type: Date, default: Date.now },
    },
  ],
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
