export interface LogInResponse {
  authenticationToken: string;
  userName: string;
  userId:number;
  refreshToken: string;
  expiresAt: string;
}