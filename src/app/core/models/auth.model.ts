export interface AuthResult {
  token: string;
  expiresAt: string;
  email: string;
  role: string;
  requiresEmailConfirmation?: boolean;
}
