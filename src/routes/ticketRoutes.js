import express from "express";
import { createTicket } from "../controllers/ticketController.js";
import { protect } from "../middleware/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import { sendMail } from "../config/mail.js";
import { io } from "../server.js";

const router = express.Router();

// ✅ CREATE TICKET (USER)
router.post("/create", protect, createTicket);

// ===============================
// 🔥 ADMIN ROUTES
// ===============================

// ✅ GET ALL TICKETS
router.get("/all", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    // 🔐 CHECK ADMIN
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE TICKET STATUS
router.put("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    // 🔐 CHECK ADMIN
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const admin = await User.findById(req.user);

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const ticket = await Ticket.findById(req.params.id).populate("user");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 🔥 SAFE EMAIL (NOW RELIABLE)
    if (ticket.user?.email) {
      await sendMail(
        ticket.user.email,
        "Your Issue is Resolved ✅",
        "Your support ticket has been resolved."
      );
    }

    await Ticket.findByIdAndDelete(req.params.id);

    io.emit("ticket-deleted", req.params.id);

    res.json({ message: "Ticket deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
