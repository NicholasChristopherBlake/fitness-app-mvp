export interface RefreshToken {
  token_id: number;
  user_id: number;
  refresh_token: string;
  // Optional
  ip_address?: string;
  browser_fingerprint?: string;
  created_at?: Date;
  expires_at?: Date;
}
