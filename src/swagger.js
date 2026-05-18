import express from "express";
import eventRoutes from "./src/routes/eventRoutes.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/utils/swagger.js";  // ⚠️ Baddelna l'import

const app = express();
const PORT = 3000;
const API_VERSION = "v1";

app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    name: "Event Manager API",
    version: "1.0.0",
    description: "Professional REST API for event management",
    baseUrl: `http://localhost:${PORT}/api/${API_VERSION}`,
    endpoints: {
      events: {
        list: `GET /api/${API_VERSION}/events`,
        create: `POST /api/${API_VERSION}/events`,
        get: `GET /api/${API_VERSION}/events/:id`,
        update: `PUT /api/${API_VERSION}/events/:id`,
        delete: `DELETE /api/${API_VERSION}/events/:id`,
        stats: `GET /api/${API_VERSION}/events/stats`
      }
    }
  });
});

app.use(`/api/${API_VERSION}/events`, eventRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + "s"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.path}`,
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('\n📡 Professional REST API Server');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔗 API v${API_VERSION} at http://localhost:${PORT}/api/${API_VERSION}`);
  console.log(`📚 API Docs at http://localhost:${PORT}/api-docs`);
  console.log('\n📋 Available Endpoints:');
  console.log(`   GET    /api/${API_VERSION}/events`);
  console.log(`   POST   /api/${API_VERSION}/events`);
  console.log(`   GET    /api/${API_VERSION}/events/:id`);
  console.log(`   PUT    /api/${API_VERSION}/events/:id`);
  console.log(`   DELETE /api/${API_VERSION}/events/:id`);
  console.log(`   GET    /api/${API_VERSION}/events/stats`);
  console.log('\n Press Ctrl+C to stop\n');
});