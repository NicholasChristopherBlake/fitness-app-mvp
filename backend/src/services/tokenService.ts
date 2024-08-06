import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "EVEN_MORE_RANDOM_SECRET_KEY974";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "MAXIMALLY_RANDOM_SECRET_KEY856";

class TokenService {
  generateTokens(payload, expiresIn: string) {
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

  async saveToken(userId, refreshToken) {}
}

export default new TokenService();
