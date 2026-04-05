import express from "express";
import eventRoutes from "./src/routes/eventRoutes.js";
import { logger, validateEventInput, measureTime, errorHandler } from "./src/middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);
app.use(measureTime);

app.get("/", (req, res) => {
  res.json({ message: "Event Manager API (MVC)", version: "1.0.0" });
});

const validateEvent = (req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    validateEventInput(req, res, next);
  } else {
    next();
  }
};

app.use("/api/events", validateEvent);
app.use("/api/events", eventRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "✅ healthy", uptime: process.uptime().toFixed(2) + "s" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Non trouvé : ${req.method} ${req.path}` });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n✅ Event Manager API (MVC) démarrée`);
  console.log(`📍 http://localhost:${PORT}\n`);
});