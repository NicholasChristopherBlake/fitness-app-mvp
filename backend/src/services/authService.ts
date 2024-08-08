import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid"; // Correct import for v4
import MailService from "./MailService";
import TokenService from "./TokenService";
import { UserDTO, UserWithTokensDTO } from "../dtos/User.dto";
import { User } from "../types/User";
import { ApiError } from "../exceptions/ApiError";
import { UserMapper } from "../mappers/UserMapper";

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
      throw ApiError.badRequest(
        `User with this username is already registered`
      );
    }

    const userExistsByEmail = await UserModel.getUserByEmail(email);
    if (userExistsByEmail) {
      throw ApiError.badRequest(`User with this email is already registered`);
    }
    // Hash the password
    const password_hash = await bcrypt.hash(password, 7);

    // Create activation link
    const activation_link = uuidv4();

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
    const userDTO: UserDTO = UserMapper.mapUserToDTO(user);

    const tokens = TokenService.generateTokens(userDTO);
    await TokenService.saveRefreshToken(userDTO.userId, tokens.refreshToken);

    return {
      ...tokens,
      ...userDTO,
    };
  }

  // Activate user with activation link
  async activate(activation_link: string): Promise<User | null> {
    const user = await UserModel.getUserByActivationLink(activation_link);
    console.log(user);
    if (!user) {
      throw ApiError.badRequest(
        `Activation link is invalid or user does not exist`
      );
    }
    // Set is_activated to true
    const activatedUser = await UserModel.activateUser(user.user_id);
    console.log(activatedUser);

    return activatedUser;
  }

  // Log in
  async login(
    usernameOrEmail: string,
    password: string
  ): Promise<UserWithTokensDTO | null> {
    // TODO add login for allowing to enter either username or email on FRONTEND in the same field or some sort of radio input
    // Get user by username or email
    const user = await UserModel.getUserByUsernameOrEmail(usernameOrEmail);

    if (!user) {
      throw ApiError.badRequest(
        "User with this username or email has not been found"
      );
    }

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw ApiError.badRequest("Password is incorrect");
    }

    // TODO we can put this login into separate function, because it doubles itself in register and login method
    // Generate tokens and put payload UserDTO there
    const userDTO: UserDTO = UserMapper.mapUserToDTO(user);

    const tokens = TokenService.generateTokens(userDTO);
    await TokenService.saveRefreshToken(userDTO.userId, tokens.refreshToken);

    return {
      ...tokens,
      ...userDTO,
    };
  }

  // Log out
  async logout(refreshToken: string): Promise<void> {
    try {
      // Remove refresh token from the database
      await TokenService.deleteRefreshTokenByTokenValue(refreshToken);
    } catch (error) {
      throw ApiError.internal(
        "Failed to logout. Could not remove refresh token"
      );
    }
  }

  // Refresh access token
  async refreshAccessToken(
    refreshToken: string
  ): Promise<UserWithTokensDTO | null> {
    const userDTO = await TokenService.validateRefreshToken(refreshToken);

    if (!userDTO) {
      throw ApiError.unauthorizedError();
    }

    // Retrieve fresh user information from the database
    const user = await UserModel.getUserById(userDTO.userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Map the user to a UserDTO
    const updatedUserDTO = UserMapper.mapUserToDTO(user);

    // Generate new tokens
    const newTokens = TokenService.generateTokens(updatedUserDTO);

    // Save the new refresh token
    await TokenService.saveRefreshToken(
      updatedUserDTO.userId,
      newTokens.refreshToken
    );

    // Optionally remove the old refresh token
    await TokenService.deleteRefreshTokenByTokenValue(refreshToken);

    return {
      ...newTokens,
      ...updatedUserDTO,
    };
  }
}

export default new AuthService();
