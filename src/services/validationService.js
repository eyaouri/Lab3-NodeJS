export class ValidationService {
  static validateEvent(data, isUpdate = false) {
    const errors = {};

    if (!isUpdate || data.title !== undefined) {
      if (!data.title) {
        errors.title = "Title is required";
      } else if (data.title.length < 3) {
        errors.title = "Title must be at least 3 characters";
      } else if (data.title.length > 100) {
        errors.title = "Title must not exceed 100 characters";
      }
    }

    if (!isUpdate || data.date !== undefined) {
      if (!data.date) {
        errors.date = "Date is required";
      } else if (isNaN(new Date(data.date).getTime())) {
        errors.date = "Date must be a valid ISO 8601 date";
      } else if (new Date(data.date) < new Date()) {
        errors.date = "Date must be in the future";
      }
    }

    if (!isUpdate || data.location !== undefined) {
      if (!data.location) {
        errors.location = "Location is required";
      } else if (data.location.length < 2) {
        errors.location = "Location must be at least 2 characters";
      } else if (data.location.length > 100) {
        errors.location = "Location must not exceed 100 characters";
      }
    }

    if (!isUpdate || data.capacity !== undefined) {
      if (data.capacity === undefined) {
        errors.capacity = "Capacity is required";
      } else if (!Number.isInteger(data.capacity)) {
        errors.capacity = "Capacity must be a number";
      } else if (data.capacity < 1) {
        errors.capacity = "Capacity must be at least 1";
      } else if (data.capacity > 10000) {
        errors.capacity = "Capacity must not exceed 10000";
      }
    }

    if (data.description && data.description.length > 1000) {
      errors.description = "Description must not exceed 1000 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateId(id) {
    return !isNaN(parseInt(id)) && parseInt(id) > 0;
  }

  static validatePagination(page, limit) {
    const errors = {};

    if (!page) page = 1;
    else if (isNaN(page) || page < 1) {
      errors.page = "Page must be a positive number";
    }

    if (!limit) limit = 10;
    else if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.limit = "Limit must be between 1 and 100";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      page: parseInt(page),
      limit: parseInt(limit)
    };
  }
}

export default ValidationService;