let events = [
  {
    id: 1,
    title: "JavaScript Workshop",
    date: "2026-02-15T10:00:00Z",
    location: "Sfax",
    capacity: 30,
    attendees: 15,
    status: "upcoming",
    description: "Learn modern JavaScript",
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: 2,
    title: "React Conference",
    date: "2026-03-20T14:00:00Z",
    location: "Tunis",
    capacity: 100,
    attendees: 45,
    status: "upcoming",
    description: "React best practices",
    createdAt: "2026-01-01T00:00:00Z"
  }
];
let nextId = 3;

export class Event {
  static getAll(filters = {}, page = 1, limit = 10) {
    let result = [...events];

    if (filters.status) {
      result = result.filter(e => e.status === filters.status);
    }
    if (filters.location) {
      result = result.filter(e =>
        e.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.search) {
      result = result.filter(e =>
        e.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.minCapacity) {
      result = result.filter(e => e.capacity >= parseInt(filters.minCapacity));
    }

    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    const total = result.length;
    const start = (page - 1) * limit;
    const paginatedResult = result.slice(start, start + limit);

    return {
      items: paginatedResult,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  static getById(id) {
    return events.find(e => e.id === parseInt(id));
  }

  static create(data) {
    const newEvent = {
      id: nextId++,
      title: data.title,
      date: data.date,
      location: data.location,
      capacity: data.capacity,
      description: data.description || "",
      attendees: 0,
      status: "upcoming",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    events.push(newEvent);
    return newEvent;
  }

  static update(id, data) {
    const event = this.getById(id);
    if (!event) return null;
    Object.assign(event, data);
    event.updatedAt = new Date().toISOString();
    return event;
  }

  static delete(id) {
    const index = events.findIndex(e => e.id === parseInt(id));
    if (index === -1) return null;
    return events.splice(index, 1)[0];
  }

  static getCount() {
    return events.length;
  }

  static exists(id) {
    return events.some(e => e.id === parseInt(id));
  }
}

export default Event;