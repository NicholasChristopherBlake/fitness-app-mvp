import { Request, Response } from "express";
import UserService from "../services/authService";
import { UserWithTokensDTO } from "../dtos/user.dto";

class AuthController {
  // Register a new user
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { username, email, password } = req.body;

      // Validate request data
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // Register new user
      const userData: UserWithTokensDTO | null = await UserService.register(
        username,
        email,
        password
      );

      if (!userData) {
        return res.status(400).json({ message: "Registration failed" });
      }

      // Save refresh token to httpOnly cookies
      res.cookie("refreshToken", userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        // TODO add flag 'secure' if using HTTPS
      });

      // Respond with the user DTO and tokens
      return res.status(201).json({
        message: "User registered successfully",
        userData,
      });
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Log in
  async login(req: Request, res: Response) {
    try {
    } catch (e) {}
  }

  // Log out
  async logout(req: Request, res: Response) {
    try {
    } catch (e) {}
  }

  // Activate account using activation link
  async activate(req: Request, res: Response) {
    try {
    } catch (e) {}
  }

  // Refresh access token
  async refresh(req: Request, res: Response) {
    try {
    } catch (e) {}
  }
}

export default new AuthController();
