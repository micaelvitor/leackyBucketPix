import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '@/core/entities/user.entity';
import { UserService } from '@/core/services/user.service';
import { AuthService } from '@/core/services/auth.service';
import { LoginInput } from '../inputs/login.input';
import { RegisterInput } from '../inputs/register.input';
import { Token } from '../types/token.type';
import { AuthPayloadI } from '@/core/services/types/auth.type';
import { userRepository } from '@/core/repositories/user.repository';
import { UseMiddleware } from 'type-graphql';
import { authMiddleware } from '@/core/middlewares/auth.middleware';

@Resolver(() => User)
export class UserResolver {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService(userRepository);
    this.authService = new AuthService(userRepository);
  }

  @Mutation(() => Token)
  async login(@Arg("data") data: LoginInput): Promise<Token> {
    const token = await this.authService.login(data.email, data.password);
    return { accessToken: token };
  }

  @Mutation(() => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    return this.userService.createUser(data.name, data.email, data.password);
  }

  @Query(() => User, { nullable: true })
  @UseMiddleware(authMiddleware)
  async me(@Ctx() ctx: { user?: AuthPayloadI }): Promise<User | null> {
    if (!ctx.user?.userId) return null;
    return this.userService.getUserById(ctx.user.userId);
  }
}