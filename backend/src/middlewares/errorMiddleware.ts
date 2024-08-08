import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err); // to not console.log it in every controller manually
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
  }

  // If the error is not an instance of ApiError, treat it as a 500 error
  return res.status(500).json({ message: "Unexpected Internal Server Error" });
};
