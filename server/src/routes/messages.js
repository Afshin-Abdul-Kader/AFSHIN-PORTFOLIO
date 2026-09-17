import { Router } from "express";
import nodemailer from "nodemailer";

import { pool } from "../db/pool.js";

export const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

router.post("/", async (req, res) => {
  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const message = clean(req.body?.message);

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Name, email and message are required." });
  }

  if (name.length > 80) {
    return res.status(400).json({ message: "Name is too long." });
  }

  if (email.length > 160 || !emailPattern.test(email)) {
    return res
      .status(400)
      .json({ message: "Please provide a valid email address." });
  }

  if (message.length > 2000) {
    return res.status(400).json({ message: "Message is too long." });
  }

  try {
    // 1. Save message to PostgreSQL
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    // 2. Send notification to your Gmail
    await transporter.sendMail({
      from: `"Afshin Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `
You received a new message through your portfolio.

Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
        <h2>New Portfolio Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <hr />

        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>

        <hr />

        <p>
          You can reply directly to this email to contact ${name}.
        </p>
      `,
    });

    return res.status(201).json({
      message: "Message received.",
    });
  } catch (error) {
    console.error("Message processing failed:", error);

    return res.status(500).json({
      message: "Unable to process message right now.",
    });
  }
});