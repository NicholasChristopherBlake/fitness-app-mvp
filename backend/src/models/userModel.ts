import pool from "../config/db";
import { User } from "../types/User";

class UserModel {
  // Get user by username
  async getUserByUsername(username: string): Promise<User | null> {
    const result = await pool.query("SELECT 1 FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0] as User | null;
  }

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] as User | null;
  }

  // Create a new user after succesful registration
  async createUser(
    username: string,
    email: string,
    password_hash: string,
    activation_link: string
  ): Promise<User> {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash, activation_link) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password_hash, activation_link]
    );
    return result.rows[0] as User;
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows as User[];
  }

  // Get a specific user by ID
  async getUserById(userId: number): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    return result.rows[0] as User | null;
  }

  // Update a user's data by ID
  async updateUser(
    userId: number,
    username: string,
    email: string,
    password_hash: string
  ): Promise<User> {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *",
      [username, email, password_hash, userId]
    );
    return result.rows[0] as User;
  }

  // Delete a user by ID
  async deleteUser(userId: number): Promise<User | null> {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [userId]
    );
    return result.rows[0] as User | null;
  }
}

export default new UserModel();
