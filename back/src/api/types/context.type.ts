import { UserService } from '@/core/services/user.service';
import { AuthenticatedUser } from './authenticatedUser.type';

export interface MyContext {
  user?: AuthenticatedUser;
  token?: string;
  services: {
    userService: UserService;
  };
}