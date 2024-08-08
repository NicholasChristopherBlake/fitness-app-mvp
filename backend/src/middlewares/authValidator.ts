import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { ApiError } from "../exceptions/ApiError";

export const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const loginValidator = [
  body("usernameOrEmail")
    .isString()
    .withMessage("Username or email must be a string")
    .notEmpty()
    .withMessage("Username or email is required"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required"),
];

// Middleware to validate refresh token from cookies
export const refreshValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if refresh token exists in cookies
  if (!req.cookies || !req.cookies.refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  // Check if the refresh token is a valid string
  if (typeof req.cookies.refreshToken !== "string") {
    return res.status(400).json({ error: "Invalid refresh token format" });
  }

  next();
};

// Middleware to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract error messages
    const errorMessages = errors.array().map((err) => err.msg);
    // Create an ApiError with validation errors
    return next(ApiError.badRequest("Validation failed", errorMessages));
  }
  next();
};

// TODO decide how to validate username/email/password. Maybe not allow passwords more than 32 symbols?
