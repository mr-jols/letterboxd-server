import { StatusCodes } from "./constants";

export class BaseError extends Error {
  public readonly code: number;
  public readonly name: string;
  public constructor(message: string, code: number, name: string) {
    super(message);
    this.code = code;
    this.name = name;
  }
}

export class BadRequestError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST, "BadRequestError");
  }
}

export class NotFoundError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND, "NotFoundError");
  }
}

export class ForbiddenError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN, "ForbiddenError");
  }
}

export class UnauthorizedError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED, "UnauthorizedError");
  }
}

export class ConflictError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.CONFLICT, "ConflictError");
  }
}

export class InternalServerError extends BaseError {
  public constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, "InternalServerError");
  }
}
