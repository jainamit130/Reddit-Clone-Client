export interface LogInResponse {
  authenticationToken: string;
  userName: string;
  refreshToken: string;
  expiresAt: string;
}