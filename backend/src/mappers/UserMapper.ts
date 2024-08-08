import { UserDTO } from "../dtos/User.dto";
import { User } from "../types/User";

export class UserMapper {
  static mapUserToDTO(user: User): UserDTO {
    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_activated: user.is_activated,
    };
  }
}
