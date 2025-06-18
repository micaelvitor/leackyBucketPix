import jwt from 'jsonwebtoken';
import { UserService } from './user.service';
import { userRepository } from '@/core/repositories/user.repository';

export interface AuthPayload {
  userId: string;
  email: string;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly userService: UserService;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
    this.userService = new UserService(userRepository);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await this.userService.validatePassword(user, password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return this.generateToken({
      userId: user.id,
      email: user.email
    });
  }

  generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: '1h'
    });
  }

  verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as AuthPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
} 