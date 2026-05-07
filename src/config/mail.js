import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

export const sendMail = async ({
  to,
  subject,
  type = "otp",
  data = {},
}) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();

   

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
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

    // ================= TICKET TEMPLATE =================
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
      </div>`;
    }

    // ================= BOOKING TEMPLATE =================
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
      </div>`;
    }

    // ✅ RAW EMAIL
    const messageParts = [
      `From: RS Education <${process.env.EMAIL_USER}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      htmlTemplate,
    ];

    const message = messageParts.join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // ✅ SEND USING GMAIL API
    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

  } catch (error) {
    console.error("❌ FULL EMAIL ERROR:", error);

    throw new Error("Email failed");
  }
};