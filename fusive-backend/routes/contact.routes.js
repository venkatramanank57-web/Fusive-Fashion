import express from "express";
import sgMail from "@sendgrid/mail";

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const msg = {
      to: process.env.RECEIVER_EMAIL,
      from: process.env.SENDER_EMAIL, // must be verified in SendGrid
      subject: subject || "New Website Enquiry",
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    };

    await sgMail.send(msg);

    res.json({ success: true, message: "Email sent successfully" });

  } catch (err) {
    console.error(err.response?.body || err.message);
    res.status(500).json({ message: "Email sending failed" });
  }
});

export default router;
