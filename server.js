import express from "express";

const app = express();
const PORT = 3001;  // Changed from 3000
const API_VERSION = "v1";

app.use(express.json());

let events = [
  { id: 1, title: "JavaScript Workshop", date: "2026-02-15T10:00:00Z", location: "Sfax", capacity: 30, attendees: 15, status: "upcoming" },
  { id: 2, title: "React Conference", date: "2026-03-20T14:00:00Z", location: "Tunis", capacity: 100, attendees: 45, status: "upcoming" }
];
let nextId = 3;

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ name: "Event Manager API", version: "1.0.0" });
});

app.get(`/api/${API_VERSION}/events`, (req, res) => {
  res.json({ success: true, data: events, count: events.length });
});

app.get(`/api/${API_VERSION}/events/:id`, (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  res.json({ success: true, data: event });
});

app.post(`/api/${API_VERSION}/events`, (req, res) => {
  const { title, date, location, capacity } = req.body;
  if (!title || !date || !location || !capacity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const newEvent = { id: nextId++, title, date, location, capacity: parseInt(capacity), attendees: 0, status: "upcoming", createdAt: new Date().toISOString() };
  events.push(newEvent);
  res.status(201).json({ success: true, data: newEvent });
});

app.put(`/api/${API_VERSION}/events/:id`, (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Event not found" });
  events[index] = { ...events[index], ...req.body };
  res.json({ success: true, data: events[index] });
});

app.delete(`/api/${API_VERSION}/events/:id`, (req, res) => {
  const index = events.findIndex(e => e.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ success: false, message: "Event not found" });
  events.splice(index, 1);
  res.status(204).send();
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api/${API_VERSION}/events`);
  console.log(`💚 Health: http://localhost:${PORT}/health\n`);
});
