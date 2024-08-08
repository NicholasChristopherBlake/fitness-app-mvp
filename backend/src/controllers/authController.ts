import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";
import { UserWithTokensDTO } from "../dtos/User.dto";
import { ApiError } from "../exceptions/ApiError";

class AuthController {
  // Register a new user
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { username, email, password } = req.body;

      // Validate request data
      if (!username || !email || !password) {
        return next(ApiError.badRequest("All fields are required"));
      }
      // Register new user
      const userData: UserWithTokensDTO | null = await AuthService.register(
        username,
        email,
        password
      );

      if (!userData) {
        return next(ApiError.badRequest("Registration failed"));
      }

      // Save refresh token to httpOnly cookies
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // TODO add flag 'secure' if using HTTPS
        // secure: process.env.NODE_ENV === 'production', // only use secure cookies in production mode
      });

      // Respond with the user DTO and tokens
      return res.status(201).json({
        message: "User registered successfully",
        userData,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(ApiError.internal(error.message));
      } else {
        next(ApiError.internal("An unexpected error occurred"));
      }
    }
  }

  // Log in
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { usernameOrEmail, password } = req.body;
      const userData: UserWithTokensDTO | null = await AuthService.login(
        usernameOrEmail,
        password
      );
      if (!userData) {
        return next(ApiError.unauthorizedError());
      }

      // Save refresh token to httpOnly cookies
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // TODO add flag 'secure' if using HTTPS
        // secure: process.env.NODE_ENV === 'production', // only use secure cookies in production mode
      });

      return res.status(200).json({
        message: "Login successful",
        userData,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(ApiError.internal(error.message));
      } else {
        next(ApiError.internal("An unexpected error occurred"));
      }
    }
  }

  // Log out
  async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { refreshToken } = req.cookies;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie("refreshToken", { httpOnly: true });
      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      if (error instanceof Error) {
        next(ApiError.internal(error.message));
      } else {
        next(ApiError.internal("An unexpected error occurred"));
      }
    }
  }

  // Activate account using activation link
  async activate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const activation_link = req.params.link; // from dynamic parameter in authRoutes
      if (!activation_link) {
        return next(
          ApiError.badRequest("Activation link is required", [
            "activation_link",
          ])
        );
      }
      const user = await AuthService.activate(activation_link);
      if (!user) {
        return next(
          ApiError.notFound("Invalid activation link", [
            "Invalid link or user not found",
          ])
        );
      }
      // default URL if env undefined
      return res.redirect(process.env.APP_BASE_URL ?? "http://localhost:3000");
    } catch (error) {
      if (error instanceof Error) {
        next(ApiError.internal(error.message));
      } else {
        next(ApiError.internal("An unexpected error occurred"));
      }
    }
  }

  // Refresh access token
  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return next(ApiError.badRequest("Refresh token is required"));
      }

      const newTokens = await AuthService.refreshAccessToken(refreshToken);

      if (!newTokens) {
        return next(ApiError.unauthorizedError());
      }

      // Save refresh token to httpOnly cookies
      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // TODO add flag 'secure' if using HTTPS
        // secure: process.env.NODE_ENV === 'production', // only use secure cookies in production mode
      });

      return res.status(200).json({
        message: "Tokens refreshed successfully",
        ...newTokens,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(ApiError.internal(error.message));
      } else {
        next(ApiError.internal("An unexpected error occurred"));
      }
    }
  }
}

export default new AuthController();
