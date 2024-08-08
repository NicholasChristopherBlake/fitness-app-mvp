export class ApiError extends Error {
  statusCode: number;
  errors: string[];
  message: string;

  constructor(statusCode: number, message: string, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.message = message;

    // Set the prototype explicitly for extending built-in classes
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors: string[] = []): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorizedError(): ApiError {
    return new ApiError(401, "User is unauthorized");
  }

  static forbidden(message: string, errors: string[] = []): ApiError {
    return new ApiError(403, message, errors);
  }

  static notFound(message: string, errors: string[] = []): ApiError {
    return new ApiError(404, message, errors);
  }

  static conflict(message: string, errors: string[] = []): ApiError {
    return new ApiError(409, message, errors);
  }

  static internal(message: string, errors: string[] = []): ApiError {
    return new ApiError(500, message, errors);
  }
}
