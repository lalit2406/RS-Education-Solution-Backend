import express from "express";
import { createBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import Booking from "../models/Booking.js";

const router = express.Router();

// ✅ CREATE BOOKING (USER)
router.post("/create", protect, createBooking);


// ===============================
// 🔥 ADMIN ROUTE (IMPORTANT)
// ===============================

// ✅ GET ALL BOOKINGS
router.get("/all", protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE BOOKING
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;