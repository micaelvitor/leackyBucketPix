import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '@/core/entities/user.entity';
import { UserService } from '@/core/services/user.service';
import { AuthService } from '@/core/services/auth.service';
import { LoginInput } from '../inputs/login.input';
import { RegisterInput } from '../inputs/register.input';
import { Token } from '../types/token.type';
import { AuthPayload } from '@/core/services/auth.service';
import { userRepository } from '@/core/repositories/user.repository';

@Resolver(() => User)
export class UserResolver {
  private userService: UserService;
  private authService: AuthService;

  constructor() {
    this.userService = new UserService(userRepository); 
    this.authService = new AuthService();
  }

  @Mutation(() => Token)
  async login(@Arg("data") data: LoginInput): Promise<Token> {
    const token = await this.authService.login(data.email, data.password);
    return { accessToken: token };
  }

  @Mutation(() => User)
  async register(@Arg("data") data: RegisterInput): Promise<User> {
    return this.userService.createUser(data.email, data.name, data.password);
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: { user?: AuthPayload }): Promise<User | null> {
    if (!ctx.user?.userId) return null;
    return this.userService.getUserById(ctx.user.userId);
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}