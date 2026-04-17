import Ticket from "../models/Ticket.js";
import { sendMail } from "../config/mail.js";
import User from "../models/User.js";
import { io } from "../server.js";

export const createTicket = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const name = user.name;
    const email = user.email;
    const { category, description } = req.body;

    const ticket = await Ticket.create({
      user: user._id,
      name,
      email,
      category,
      description,
    });

    // 🔥 REAL-TIME EVENT
io.emit("new-ticket", ticket);

    // send email to admin
    await sendMail(
      "youradmin@gmail.com",
      "New Support Ticket",
      `New ticket from ${name}\nCategory: ${category}\n${description}`,
    );

    // send confirmation to user (optional)
    if (email) {
      await sendMail(
        email,
        "Ticket Received",
        "We received your request. Our team will contact you within 24 hours.",
      );
    }

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = req.body.status || ticket.status;

    await ticket.save();

    // 🔥 REAL-TIME UPDATE
    io.emit("ticket-updated", ticket);

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // 🔥 REAL-TIME DELETE EVENT
    io.emit("ticket-deleted", req.params.id);

    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};