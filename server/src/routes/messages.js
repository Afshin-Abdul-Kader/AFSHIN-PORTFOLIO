import { Router } from "express";
import { Resend } from "resend";
import { pool } from "../db/pool.js";

export const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

router.post("/", async (req, res) => {
  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const message = clean(req.body?.message);

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Name, email and message are required."
    });
  }

  if (name.length > 80) {
    return res.status(400).json({
      message: "Name is too long."
    });
  }

  if (email.length > 160 || !emailPattern.test(email)) {
    return res.status(400).json({
      message: "Please provide a valid email address."
    });
  }

  if (message.length > 2000) {
    return res.status(400).json({
      message: "Message is too long."
    });
  }

  // 1. Save message to PostgreSQL
  try {
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
  } catch (error) {
    console.error("Message insert failed:", error);

    return res.status(500).json({
      message: "Unable to save message right now."
    });
  }

  // 2. Send email notification
  // Email failure will NOT break the successful database submission.
  if (resend && process.env.NOTIFICATION_EMAIL) {
    try {
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeMessage = escapeHtml(message);

      const { error } = await resend.emails.send({
        from: "Afshin Portfolio <onboarding@resend.dev>",
        to: [process.env.NOTIFICATION_EMAIL],
        subject: `New portfolio message from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>New Portfolio Contact</h2>

            <p>
              <strong>Name:</strong> ${safeName}
            </p>

            <p>
              <strong>Email:</strong> ${safeEmail}
            </p>

            <p>
              <strong>Message:</strong>
            </p>

            <p style="white-space: pre-wrap;">
              ${safeMessage}
            </p>
          </div>
        `,
        text: `New Portfolio Contact

Name: ${name}
Email: ${email}

Message:
${message}`
      });

      if (error) {
        console.error("Email notification failed:", error);
      } else {
        console.log("Email notification sent successfully.");
      }
    } catch (error) {
      console.error("Email notification failed:", error);
    }
  } else {
    console.warn(
      "Email notification skipped: RESEND_API_KEY or NOTIFICATION_EMAIL is missing."
    );
  }

  // 3. Always return success if the database saved the message
  return res.status(201).json({
    message: "Message received."
  });
});