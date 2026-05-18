import express from "express";
import EventController from "../controllers/eventController.js";

const router = express.Router();

router.get("/", EventController.getAllEvents);
router.post("/", EventController.createEvent);
router.get("/stats", EventController.getStats);
router.get("/:id", EventController.getEventById);
router.put("/:id", EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

export default router;