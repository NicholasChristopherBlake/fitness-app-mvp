import UserModel from "../models/userModel";

class UserService {
  async createUser(username: string, email: string, password_hash: string) {
    return UserModel.createUser(username, email, password_hash);
  }

  async getAllUsers() {
    return UserModel.getAllUsers();
  }

  async getUserById(userId: number) {
    return UserModel.getUserById(userId);
  }

  async updateUser(
    userId: number,
    username: string,
    email: string,
    password_hash: string
  ) {
    return UserModel.updateUser(userId, username, email, password_hash);
  }

  async deleteUser(userId: number) {
    return UserModel.deleteUser(userId);
  }
}

export default new UserService();
