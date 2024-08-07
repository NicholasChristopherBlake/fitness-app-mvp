import { UserDTO } from "../dtos/user.dto";
import TokenModel from "../models/tokenModel";
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
}

export default new TokenService();
