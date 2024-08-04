import pool from "../config/db";

class UserModel {
  // Create a new user
  async createUser(username: string, email: string, password_hash: string) {
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password_hash]
    );
    return result.rows[0];
  }

  // Get all users
  async getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  // Get a specific user by ID
  async getUserById(userId: number) {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    return result.rows[0];
  }

  // Update a user's data by ID
  async updateUser(
    userId: number,
    username: string,
    email: string,
    password_hash: string
  ) {
    const result = await pool.query(
      "UPDATE users SET username = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *",
      [username, email, password_hash, userId]
    );
    return result.rows[0];
  }

  // Delete a user by ID
  async deleteUser(userId: number) {
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [userId]
    );
    return result.rows[0];
  }
}

export default new UserModel();
