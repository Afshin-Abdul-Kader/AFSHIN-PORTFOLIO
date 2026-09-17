import { Router } from "express";
import { pool } from "../db/pool.js";

export const router = Router();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

router.post("/", async (req, res) => {
  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const message = clean(req.body?.message);

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

  try {
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    console.log("Contact message saved:", {
      name,
      email
    });

    return res.status(201).json({
      message: "Message received."
    });

  } catch (error) {
    console.error("Message insert failed:", error);

    return res.status(500).json({
      message: "Unable to save message right now."
    });
  }
});