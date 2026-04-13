// server/src/routes/authRoutes.js

import express from "express";

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  verifyOtp,
  resendOtp,
  verifyForgotOtp,
  setPassword,
  googleAuth,
  updateProfile

} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ===============================
// 🔹 AUTH ROUTES
// ===============================

// 🔐 Signup + OTP
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

// 🔐 Login
router.post("/login", login);

// 🔐 Google Auth
router.post("/google-auth", googleAuth);

// 🔐 Forgot Password (OTP based)
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOtp);
router.post("/reset-password", resetPassword);
router.post("/set-password", setPassword);

// 🔐 Protected route
router.get("/me", protect, getMe);

// 🔐 Update Profile
router.put("/update-profile", protect, updateProfile);

export default router;