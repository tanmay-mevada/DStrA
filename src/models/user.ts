import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "student"], default: "student" },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
