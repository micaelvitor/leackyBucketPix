import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

export interface AuthPayload {
  password: string;
  email: string;
}

export class AuthService {
  private readonly jwtSecret: jwt.Secret;

  /**
   * Initialize the service with the JWT secret from the environment variables.
   * The secret is required for signing and verifying the JWT tokens.
   * If not provided, the service will throw an error when trying to use it.
   */
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
  }

  generateToken(payload: AuthPayload): string {
    const options: SignOptions = {
      expiresIn: '1h',
    };
    return jwt.sign(payload, this.jwtSecret, options);
  }

  verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthPayload;
    } catch (error) {
      console.error('Error while verifying JWT token:', error);
      return null;
    }
  }
}