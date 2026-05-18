export class ApiResponse {
  constructor(success, data = null, message = "", statusCode = 200) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = "Success", statusCode = 200) {
    return new ApiResponse(true, data, message, statusCode);
  }

  static created(data, message = "Resource created successfully") {
    return new ApiResponse(true, data, message, 201);
  }

  static error(message, statusCode = 400, data = null) {
    return new ApiResponse(false, data, message, statusCode);
  }

  static notFound(resource = "Resource") {
    return new ApiResponse(false, null, `${resource} not found`, 404);
  }

  static validationError(errors) {
    return new ApiResponse(false, errors, "Validation failed", 422);
  }

  static paginated(items, page, limit, total, message = "Success") {
    return {
      success: true,
      data: items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      message: message,
      timestamp: new Date().toISOString()
    };
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      message: this.message,
      timestamp: this.timestamp
    };
  }
}

export default ApiResponse;