import { Request, Response } from "express";
import pool from "../config/db";

class UserController {
  // Create a new user
  async createUser(req: Request, res: Response): Promise<void> {
    const { username, email, password_hash } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
        [username, email, password_hash]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await pool.query("SELECT * FROM users");
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  }

  // Get a specific user by ID
  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id);

    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [userId]
      );
      const user = result.rows[0];

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
      const result = await pool.query(
        "UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *",
        [username, email, password_hash, userId]
      );
      const user = result.rows[0];

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
      const result = await pool.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING *",
        [userId]
      );
      const user = result.rows[0];

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
