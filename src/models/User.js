// server/src/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      default: null, // 🔥 IMPORTANT
    },

    school: {
      type: String,
    },

    exam: {
      type: String,
    },

    score: {
      type: String,
    },

    universities: {
      type: [String],
      default: [],
    },

    academic: {
      gpa: {
        type: String,
        match: /^[0-9.]+$/, // only numbers
      },
      achievement: {
        type: String,
        default: "",
      },
    },

    // 🔐 EMAIL VERIFICATION
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🔢 OTP SYSTEM
    otp: {
      type: String,
    },

    otpExpiry: {
      type: Date,
    },

    // 🔑 AUTH PROVIDER
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    // 🔵 GOOGLE AUTH
    googleId: {
      type: String,
    },

    // 🔁 LEGACY RESET (optional fallback)
    resetToken: {
      type: String,
    },

    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;