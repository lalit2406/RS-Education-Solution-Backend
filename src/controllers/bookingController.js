import Booking from "../models/Booking.js";
import User from "../models/User.js";
import { io } from "../server.js";
import { sendMail } from "../config/mail.js";

export const createBooking = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const { phone, date, time } = req.body;

    // 🔥 VALIDATION
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    const booking = await Booking.create({
      name: user.name,
      email: user.email,
      phone,
      date,
      time,
    });

    // 🔥 REAL-TIME EVENT
io.emit("new-booking", booking);

    // 🔥 SEND CUSTOM EMAIL HERE
   await sendMail(
  user.email,
  "📞 RS Education - Call Confirmation",
  `
Dear ${user.name},

Thank you for booking a consultation with RS Education.

🗓 Date: ${date}
⏰ Time: ${time}

Our advisor will contact you shortly.

Best regards,
RS Education Team
`
);

    res.status(201).json(booking);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};