import pool from "../config/db";

class TokenModel {
  // Save a refresh token to the database
  // If refresh token already exists - update it
  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await pool.query(
      `INSERT INTO users_refresh_tokens (user_id, refresh_token) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET refresh_token = EXCLUDED.refresh_token`,
      [userId, refreshToken]
    );
    // TODO right now user_id is unique here. If you want to add multiple tokens here - change that
  }

  // Get the refresh token by user ID
  async getRefreshTokenByUserId(userId: number): Promise<string | null> {
    const result = await pool.query(
      "SELECT refresh_token FROM users_refresh_tokens WHERE user_id = $1",
      [userId]
    );
    return result.rows[0]?.refresh_token || null;
  }

  // Delete the refresh token by user ID
  async deleteRefreshToken(userId: number): Promise<void> {
    await pool.query("DELETE FROM users_refresh_tokens WHERE user_id = $1", [
      userId,
    ]);
  }
}

export default new TokenModel();
