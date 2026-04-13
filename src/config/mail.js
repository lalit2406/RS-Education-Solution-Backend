import nodemailer from "nodemailer";

export const sendMail = async (to, subject, otp, name = "User") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 PROFESSIONAL HTML TEMPLATE
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; background:#f5f7fb; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
          
          <h2 style="color:#8b5e3c;">R.S Education Solution</h2>
          <p style="color:#555; font-size:16px;">
            Hi ${name}, verify your email to continue
          </p>

          <div style="margin:30px 0;">
            <span style="font-size:32px; letter-spacing:6px; font-weight:bold; color:#333;">
              ${otp}
            </span>
          </div>

          <p style="color:#777; font-size:14px;">
            This OTP is valid for 5 minutes. Do not share it with anyone.
          </p>

          <hr style="margin:25px 0;" />

          <p style="font-size:12px; color:#aaa;">
            © ${new Date().getFullYear()} R.S Education Solution. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"R.S Education" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlTemplate, // 🔥 USE HTML INSTEAD OF TEXT
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully");

  } catch (error) {
    console.error("❌ Email error:", error.message);
    throw new Error("Email could not be sent");
  }
};