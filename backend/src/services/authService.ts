import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // Correct import for v4
import MailService from "./mailService";
import TokenService from "./tokenService";
import { UserDTO, UserWithTokensDTO } from "../dtos/user.dto";

class AuthService {
  // Register new user
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<UserWithTokensDTO> {
    // Check if the user already exists
    const userExistsByUsername = await UserModel.getUserByUsername(username);
    if (userExistsByUsername) {
      throw new Error("Username is already taken");
    }

    const userExistsByEmail = await UserModel.getUserByEmail(email);
    if (userExistsByEmail) {
      throw new Error("Email is already registered");
    }
    // Hash the password
    const password_hash = await bcrypt.hash(password, 7);

    // Create activation link
    const activation_uuid = uuidv4();
    const activation_link = `${process.env.APP_BASE_URL}/api/auth/activate/${activation_uuid}`;

    // Create the new user
    const user = await UserModel.createUser(
      username,
      email,
      password_hash,
      activation_link
    );
    // Send activation link by email
    await MailService.sendActivationEmail(email, activation_link);
    // Generate tokens and put payload UserDTO there
    const userDTO: UserDTO = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_activated: user.is_activated,
    };

    const tokens = TokenService.generateTokens(userDTO);
    await TokenService.saveRefreshToken(userDTO.userId, tokens.refreshToken);

    return {
      ...tokens,
      ...userDTO,
    };
  }
}

export default new AuthService();
