import Contact from "../models/Contact.js";
import { sendMail } from "../config/mail.js";
import { io } from "../server.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ SAVE TO DB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    // 🔥 REAL-TIME EVENT
    io.emit("new-contact", contact);

    // 📧 EMAIL TO ADMIN
    await sendMail({
      to: "youradmin@gmail.com",
      subject: `New Contact Message: ${subject || "No Subject"}`,
      type: "reply",
      data: {
        name: "Admin",
        reply: `
New contact message received:

Name: ${name}
Email: ${email}

Message:
${message}
    `,
      },
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
