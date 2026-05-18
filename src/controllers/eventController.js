import Event from "../models/Event.js";
import ApiResponse from "../utils/apiResponse.js";
import ValidationService from "../services/validationService.js";

export class EventController {
  static async getAllEvents(req, res) {
    try {
      const { status, location, search, minCapacity, page = 1, limit = 10 } = req.query;

      const { isValid, errors, page: validPage, limit: validLimit } =
        ValidationService.validatePagination(page, limit);

      if (!isValid) {
        return res.status(400).json(
          ApiResponse.error("Invalid pagination parameters", 400, errors)
        );
      }

      const filters = {};
      if (status) filters.status = status;
      if (location) filters.location = location;
      if (search) filters.search = search;
      if (minCapacity) filters.minCapacity = minCapacity;

      const result = Event.getAll(filters, validPage, validLimit);

      res.status(200).json(
        ApiResponse.paginated(
          result.items,
          result.page,
          result.limit,
          result.total,
          `Retrieved ${result.items.length} events`
        )
      );
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }

  static async getEventById(req, res) {
    try {
      const { id } = req.params;

      if (!ValidationService.validateId(id)) {
        return res.status(400).json(ApiResponse.error("Invalid event ID format", 400));
      }

      const event = Event.getById(id);
      if (!event) {
        return res.status(404).json(ApiResponse.notFound("Event"));
      }

      res.status(200).json(ApiResponse.success(event, "Event retrieved successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }

  static async createEvent(req, res) {
    try {
      const { title, date, location, capacity, description } = req.body;

      const validation = ValidationService.validateEvent({
        title, date, location, capacity, description
      });

      if (!validation.isValid) {
        return res.status(422).json(ApiResponse.validationError(validation.errors));
      }

      const newEvent = Event.create({ title, date, location, capacity, description });

      res.status(201).json(ApiResponse.created(newEvent, "Event created successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;

      if (!ValidationService.validateId(id)) {
        return res.status(400).json(ApiResponse.error("Invalid event ID format", 400));
      }

      if (!Event.exists(id)) {
        return res.status(404).json(ApiResponse.notFound("Event"));
      }

      const validation = ValidationService.validateEvent(req.body, true);

      if (!validation.isValid) {
        return res.status(422).json(ApiResponse.validationError(validation.errors));
      }

      const updated = Event.update(id, req.body);

      res.status(200).json(ApiResponse.success(updated, "Event updated successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      if (!ValidationService.validateId(id)) {
        return res.status(400).json(ApiResponse.error("Invalid event ID format", 400));
      }

      const deleted = Event.delete(id);

      if (!deleted) {
        return res.status(404).json(ApiResponse.notFound("Event"));
      }

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }

  static async getStats(req, res) {
    try {
      const events = Event.getAll({}, 1, 10000).items;

      const stats = {
        totalEvents: Event.getCount(),
        totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
        totalAttendees: events.reduce((sum, e) => sum + e.attendees, 0),
        avgCapacity: events.length > 0 ? Math.round(
          events.reduce((sum, e) => sum + e.capacity, 0) / events.length
        ) : 0,
        statusBreakdown: {
          upcoming: events.filter(e => e.status === "upcoming").length,
          ongoing: events.filter(e => e.status === "ongoing").length,
          completed: events.filter(e => e.status === "completed").length
        }
      };

      res.status(200).json(ApiResponse.success(stats, "Statistics retrieved successfully"));
    } catch (error) {
      console.error(error);
      res.status(500).json(ApiResponse.error("Internal server error", 500));
    }
  }
}

export default EventController;