import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
  // Create a new user
  // async createUser(req: Request, res: Response): Promise<void> {
  //   const { username, email, password_hash } = req.body;

  //   try {
  //     const user = await UserService.createUser(username, email, password_hash);
  //     res.status(201).json(user);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ error: "An error occurred while creating the user" });
  //   }
  // }

  // Get all users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  }

  // Get a specific user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);

    try {
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Exit early to ensure nothing is returned after this point
      }

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user" });
    }
  }

  // Update a user's data
  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);
    const { username, email, password_hash } = req.body;

    try {
      const user = await UserService.updateUser(
        userId,
        username,
        email,
        password_hash
      );

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Exit early to ensure nothing is returned after this point
      }

      res.status(200).json(user);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while updating the user" });
    }
  }

  // Delete a user by ID
  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);

    try {
      const user = await UserService.deleteUser(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return; // Exit early to ensure nothing is returned after this point
      }

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user" });
    }
  }
}

export default new UserController();
