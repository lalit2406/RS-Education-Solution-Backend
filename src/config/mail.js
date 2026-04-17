import nodemailer from "nodemailer";

export const sendMail = async ({ to, subject, type = "otp", data = {} }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let htmlTemplate = "";

    // ================= OTP TEMPLATE =================
    if (type === "otp") {
      htmlTemplate = `
      <div style="font-family: Arial; padding:20px;">
        <h2>R.S Education Solution</h2>
        <p>Hi ${data.name || "User"}, verify your email</p>
        <h1>${data.otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      </div>`;
    }

    // ================= REPLY TEMPLATE =================
    if (type === "reply") {
      htmlTemplate = `
      <div style="font-family: Arial; background:#f5f7fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#fff; padding:25px; border-radius:10px;">
          
          <h2 style="color:#8b5e3c;">RS Education</h2>

          <p style="font-size:16px;">Hello ${data.name},</p>

          <p style="font-size:15px; color:#333;">
            ${data.reply}
          </p>

          <br/>

          <p style="color:#555;">Regards,<br/>RS Education Team</p>

          <hr/>

          <p style="font-size:12px; color:#aaa;">
            This is a response to your query.
          </p>

        </div>
      </div>`;
    }

    if (type === "ticket") {
      htmlTemplate = `
    <div style="font-family: Arial; padding:20px;">
      <h2>RS Education</h2>
      <p>Hello ${data.name},</p>

      <p>Your support ticket has been resolved ✅</p>

      <p style="color:#555;">
        ${data.message}
      </p>

      <br/>
      <p>Regards,<br/>RS Education Team</p>
    </div>
  `;
    }

    if (type === "booking") {
      htmlTemplate = `
    <div style="font-family: Arial; padding:20px;">
      <h2>RS Education</h2>
      <p>Hello ${data.name},</p>

      <p>Your consultation has been booked successfully 📞</p>

      <p>
        Date: ${data.date}<br/>
        Time: ${data.time}
      </p>

      <p>Our advisor will contact you shortly.</p>

      <br/>
      <p>Regards,<br/>RS Education Team</p>
    </div>
  `;
    }

    await transporter.sendMail({
      from: `"RS Education" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate,
    });

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Email failed");
  }
};
