import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { sendMail } from "../config/mail.js";

export const createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const { phone, date, time, service } = req.body;

    // 🔥 VALIDATION
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    if (!service) {
      return res.status(400).json({
        message: "Service is required",
      });
    }

    const booking = await Booking.create({
      name: user.name,
      email: user.email,
      phone,
      date,
      time,
      service,
    });

    // 🔥 REAL-TIME EVENT
    io.emit("new-booking", booking);

    await sendMail({
      to: user.email,
      subject: "📞 Booking Confirmation",
      type: "booking",
      data: {
        name: user.name,
        date,
        time,
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
