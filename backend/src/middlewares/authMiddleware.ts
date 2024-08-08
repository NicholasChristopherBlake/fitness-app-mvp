import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/ApiError";
import { Role } from "../types/User";
import TokenService from "../services/TokenService";
import { UserDTO } from "../dtos/User.dto";

// Middleware for role-based access control
export const authorize =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const user = req.user as UserDTO;

      if (!user) {
        return next(ApiError.unauthorizedError());
      }

      if (!roles.includes(user.role)) {
        return next(ApiError.forbidden("Access denied"));
      }

      next();
    } catch (error) {
      next(ApiError.internal("An error occurred during authorization"));
    }
  };

// Middleware for authentication
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get Authorization header from request
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(ApiError.unauthorizedError());
    }

    // Split token to get access token: Bearer ${ACCESS_TOKEN}
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.unauthorizedError());
    }

    // Validate access token
    const userDTO = await TokenService.validateAccessToken(accessToken);
    if (!userDTO) {
      return next(ApiError.unauthorizedError());
    }

    // Assign userDTO to req.user
    // @ts-ignore
    req.user = userDTO;

    next();
  } catch (error) {
    next(ApiError.unauthorizedError());
  }
};
