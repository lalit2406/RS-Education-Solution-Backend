import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";
import { contactLimiter } from "../middleware/rateLimiter.js";
import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import { io } from "../server.js";
import { sendMail } from "../config/mail.js";

const router = express.Router();

// ✅ CREATE CONTACT
router.post("/", contactLimiter, sendContactMessage);

// ✅ GET ALL (ADMIN)
router.get("/all", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Contact.findByIdAndDelete(req.params.id);

    io.emit("contact-deleted", req.params.id);

    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/reply/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { reply } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    contact.reply = reply;
    contact.replied = true;
    contact.read = true;

    await contact.save();

    await sendMail({
      to: contact.email,
      subject: "Reply from RS Education",
      type: "reply",
      data: {
        name: contact.name,
        reply: reply,
      },
    });

    // 🔥 REAL-TIME UPDATE
    io.emit("contact-updated", contact);

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/mark/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    // 🔥 TOGGLE
    contact.read = !contact.read;

    await contact.save();

    // 🔥 REAL-TIME
    io.emit("contact-updated", contact);

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
