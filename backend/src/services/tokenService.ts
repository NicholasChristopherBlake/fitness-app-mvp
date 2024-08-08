import { UserDTO } from "../dtos/User.dto";
import { ApiError } from "../exceptions/ApiError";
import TokenModel from "../models/TokenModel";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "EVEN_MORE_RANDOM_SECRET_KEY974";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "MAXIMALLY_RANDOM_SECRET_KEY856";

class TokenService {
  generateTokens(payload: UserDTO) {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    // TODO Do it for multiple devices, save multiple tokens for 1 user
    await TokenModel.saveRefreshToken(userId, refreshToken);
    // QUESTION return Token?
  }

  // Remove refresh token by token value
  async deleteRefreshTokenByTokenValue(refreshToken: string): Promise<void> {
    try {
      await TokenModel.deleteRefreshTokenByTokenValue(refreshToken);
    } catch (error) {
      throw ApiError.internal("Failed to remove refresh token");
    }
  }

  // Validate access token
  async validateAccessToken(accessToken: string): Promise<UserDTO | null> {
    try {
      const decodedUserDTO = jwt.verify(
        accessToken,
        JWT_ACCESS_SECRET
      ) as UserDTO;
      return decodedUserDTO;
    } catch (error) {
      return null;
    }
  }

  // Validate refresh token
  async validateRefreshToken(refreshToken: string): Promise<UserDTO | null> {
    try {
      // Check if the refresh token exists in the database
      const tokenExists = await TokenModel.getRefreshTokenByTokenValue(
        refreshToken
      );
      if (!tokenExists) {
        return null;
      }

      // Verify the token with JWT
      const decodedUserDTO = jwt.verify(
        refreshToken,
        JWT_REFRESH_SECRET
      ) as UserDTO;

      return decodedUserDTO;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
