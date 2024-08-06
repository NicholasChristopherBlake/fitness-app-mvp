export type Role = "admin" | "free" | "guest";

export type Status = "active" | "inactive";

export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  // Optional
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  role: Role;
  status: Status;
  created_at?: Date;
  updated_at?: Date;
  last_login?: Date;
  preferences?: {}; // ? what's here?
  is_activated?: boolean;
  activation_link?: string | null;
}
