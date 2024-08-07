import { Role } from "../types/User";

export interface UserDTO {
  userId: number;
  username: string;
  email: string;
  role: Role;
  is_activated?: boolean;
}

export interface UserWithTokensDTO extends UserDTO {
  accessToken: string;
  refreshToken: string;
}
