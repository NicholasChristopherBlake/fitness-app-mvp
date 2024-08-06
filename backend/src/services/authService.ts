import UserModel from "../models/userModel";
import { User } from "../types/User";
import bcrypt from "bcrypt";
import uuid from "uuid";
import MailService from "./mailService";

class AuthService {
  // Register new user
  async register(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
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
    const activation_link = uuid.v4();

    // Create the new user
    const user = await UserModel.createUser(
      username,
      email,
      password_hash,
      activation_link
    );
    // Send activation link by email
    await MailService.sendActivationEmail(email, activation_link);

    return user;
  }
}

export default new AuthService();
