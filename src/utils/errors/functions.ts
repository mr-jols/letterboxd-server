import { Response } from "express";
import { StatusCodes } from "./constants";
import { Error as MongooseError } from "mongoose";
import { AxiosError } from "axios";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "./errors";

interface ErrorResponse {
  error: {
    name: string;
    message: string;
    code: number;
  };
}

export function ErrorHandler(
  res: Response,
  error: Error
): Response<ErrorResponse> {
  switch (error.name) {
    case "ValidationError":
      return ((): any => {
        const err = error as MongooseError.ValidationError;
        const validationErrors: string[] = [];
        for (const key in err.errors)
          validationErrors.push(`${err.errors[key].message}`);
        return ErrorResponder(
          res,
          err,
          StatusCodes.BAD_REQUEST,
          validationErrors.join(", ")
        );
      })();
    case "ConflictError":
      return ErrorResponder(res, error, (error as ConflictError).code);
    case "BadRequestError":
      return ErrorResponder(res, error, (error as BadRequestError).code);
    case "UnauthorizedError":
      return ErrorResponder(res, error, (error as UnauthorizedError).code);
    case "NotFoundError":
      return ErrorResponder(res, error, (error as NotFoundError).code);
      case "ForbiddenError":
        return ErrorResponder(res, error, (error as ForbiddenError).code);
    case "AxiosError":
      return ErrorResponder(
        res,
        error,
        (error as AxiosError).response?.status ?? 500
      );
    default:
      return ErrorResponder(res, error, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


function ErrorResponder(
  res: Response,
  error: Error,
  status: number,
  message?: string
): Response<ErrorResponse> {
  // console.log(error.stack);
  return res.status(status).json({
      error: error.name,
      message: message ? message : error.message,
      status,
  });
}

export class ValidationErrorMessages {
  public static required = (val: string): string => `${val} is required`;
  public static tooShort = (val: string): string => `${val} is too short`;
  public static tooLong = (val: string): string => `${val} is too long`;
  public static invalid = (val: string): string => `Invalid ${val}`;
}
