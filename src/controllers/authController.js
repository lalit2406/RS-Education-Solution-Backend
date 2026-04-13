// server/src/controllers/authController.js

import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../config/mail.js";
import { generateToken } from "../utils/generateToken.js";
import { verifyGoogleToken } from "../config/googleAuth.js";
import dotenv from "dotenv";
dotenv.config();

// ===============================
// 🔹 SIGNUP (WITH OTP)
// ===============================
import { generateOTP, otpExpiryTime } from "../utils/otpGenerator.js";

export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    let user;

    if (userExists) {
      // update existing unverified user
      userExists.name = name;
      userExists.phone = phone;
      userExists.password = hashedPassword;
      userExists.otp = otp;
      userExists.otpExpiry = otpExpiryTime();

      user = await userExists.save();
    } else {
      user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        otp,
        otpExpiry: otpExpiryTime(),
      });
    }

    // 📩 SEND OTP EMAIL
    await sendMail(
      email,
      "Verify Your Email",
      otp,
      user.name
    );

    res.status(200).json({
      message: "OTP sent to email. Please verify.",
      email,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// 🔹 LOGIN (WITH VERIFICATION CHECK)
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Account does not exist. Please create account first.",
      });
    }

    // 🔒 CHECK IF VERIFIED
    if (!user.isVerified) {
      // generate new OTP
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpiry = otpExpiryTime();

      await user.save();

      await sendMail(
        email,
        "Verify Your Email",
        otp,
        user.name
      );

      return res.status(403).json({
        message: "Email not verified. OTP sent again.",
        isVerified: false,
        email,
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// 🔹 FORGOT PASSWORD (SEND OTP)
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = otpExpiryTime();

    await user.save();

    await sendMail(
      email,
      "Password Reset OTP",
      otp,
      user.name
    );

    res.json({
      message: "OTP sent to email",
      email,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 VERIFY FORGOT OTP
// ===============================
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.json({
      message: "OTP verified",
      email,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// 🔹 RESET PASSWORD (OTP BASED)
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 GET CURRENT USER
// ===============================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ===============================
// 🔹 VERIFY OTP (UPDATED FOR GOOGLE)
// ===============================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    // 🔥 IF GOOGLE USER → FORCE PASSWORD SET
    if (user.provider === "google" && !user.password) {
      return res.json({
        message: "OTP verified. Please set password.",
        requirePasswordSetup: true,
        email,
      });
    }

    // ✅ NORMAL USER LOGIN
    const token = generateToken(user._id);

    res.json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 RESEND OTP
// ===============================
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = otpExpiryTime();

    await user.save();

    await sendMail(
      email,
      "Resend OTP",
      otp,
      user.name
    );

    res.json({ message: "OTP resent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 GOOGLE AUTH
// ===============================


export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = await verifyGoogleToken(token);
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    // ✅ EXISTING GOOGLE USER
    if (user && user.provider === "google") {

      // ❗ CHECK VERIFICATION
      if (!user.isVerified) {
        const otp = generateOTP();

        user.otp = otp;
        user.otpExpiry = otpExpiryTime();
        await user.save();

        await sendMail(email, "Verify Your Email", otp, user.name);

        return res.status(403).json({
          message: "Email not verified. OTP sent.",
          email,
          isVerified: false,
        });
      }

      // ✅ VERIFIED → LOGIN
      const jwtToken = generateToken(user._id);

      return res.json({
        message: "Login successful",
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // 🔄 EXISTING LOCAL USER → LINK GOOGLE ACCOUNT
    if (user && user.provider !== "google") {

      user.provider = "google";
      user.googleId = googleId;

      await user.save();

      // ❗ IF NOT VERIFIED → SEND OTP
      if (!user.isVerified) {
        const otp = generateOTP();

        user.otp = otp;
        user.otpExpiry = otpExpiryTime();
        await user.save();

        await sendMail(email, "Verify Your Email", otp, user.name);

        return res.status(403).json({
          message: "Email not verified. OTP sent.",
          email,
          isVerified: false,
        });
      }

      // ✅ LOGIN DIRECTLY
      const jwtToken = generateToken(user._id);

      return res.json({
        message: "Login successful",
        token: jwtToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    }

    // 🆕 NEW USER → OTP
    const otp = generateOTP();

    user = await User.create({
      name,
      email,
      googleId,
      provider: "google",
      isVerified: false,
      otp,
      otpExpiry: otpExpiryTime(),
    });

    await sendMail(email, "Verify Your Email", otp, user.name);

    return res.status(200).json({
      message: "OTP sent to email",
      email,
      isNewUser: true,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 SET PASSWORD (GOOGLE USER)
// ===============================
export const setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Password set successfully",
      token,
      user,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// 🔹 UPDATE PROFILE
// ===============================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      phone,
      school,
      exam,
      score,
      universities,
      academic,
    } = req.body;

    if (academic) {
      user.academic = {
        gpa: academic.gpa || user.academic?.gpa,
        achievement: academic.achievement || user.academic?.achievement,
      };
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.school = school || user.school;
    user.exam = exam || user.exam;
    user.score = score || user.score;
    user.universities = universities || user.universities;
    const updatedUser = await user.save();

    // 🔐 REMOVE SENSITIVE FIELDS
    const safeUser = await User.findById(updatedUser._id).select(
      "-password -otp -otpExpiry -resetToken -resetTokenExpiry -googleId"
    );

    res.json({
      message: "Profile updated successfully",
      user: safeUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};