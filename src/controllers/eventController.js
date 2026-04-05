import Event from "../models/Event.js";

export class EventController {
  static getAllEvents(req, res) {
    try {
      const events = Event.getAll();
      res.json({ success: true, count: events.length, data: events });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }

  static getEventById(req, res) {
    try {
      const event = Event.getById(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: "Event not found" });
      res.json({ success: true, data: event });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }

  static createEvent(req, res) {
    try {
      const { title, date, location, capacity } = req.body;
      const newEvent = Event.create({ title, date, location, capacity });
      res.status(201).json({ success: true, message: "Créé avec succès", data: newEvent });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
  }

  static updateEvent(req, res) {
    try {
      const updated = Event.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, message: "Event not found" });
      res.json({ success: true, message: "Mis à jour", data: updated });
    } catch (err) { res.status(400).json({ success: false, message: err.message }); }
  }

  static deleteEvent(req, res) {
    try {
      const deleted = Event.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Event not found" });
      res.json({ success: true, message: "Supprimé", data: deleted });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
}

export default EventController;