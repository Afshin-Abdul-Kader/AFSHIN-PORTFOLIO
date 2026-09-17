import cors from "cors";
import express from "express";
import { router as healthRouter } from "./routes/health.js";
import { router as messageRouter } from "./routes/messages.js";

export function createApp() {
  const app = express();

  const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
  app.use(cors({ origin: allowedOrigin }));
  app.use(express.json({ limit: "20kb" }));

  app.disable("x-powered-by");

  app.get("/", (_req, res) => {
    res.json({ service: "afshin-portfolio-api", status: "ok" });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/messages", messageRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found." });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  });

  app.use(
  cors({
    origin: [
      "https://afshin-portfolio-client.vercel.app",
    ],
  })
);

app.use(
  cors({
    origin: [
      "https://afshin-portfolio-client.vercel.app",
      "http://localhost:5173",
    ],
  })
);

  return app;
}
