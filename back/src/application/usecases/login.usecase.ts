import { AuthService } from '@/application/services/auth/auth.service';

interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(private authService: AuthService) {}

  async execute(input: LoginInput): Promise<string> {
    const token = this.authService.generateToken(input);
    return token;
  }
}