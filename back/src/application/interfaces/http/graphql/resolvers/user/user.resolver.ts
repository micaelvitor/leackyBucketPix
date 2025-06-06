import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { User } from '@/application/domain/user/user';
import { LoginUseCase } from '@/application/usecases/login.usecase';
import { AuthService } from '@/application/services/auth/auth.service';
import { LoginInput } from './inputs/login.input';
import { Token } from './types/token';

@Resolver(() => User)
export class UserResolver {
  private loginUseCase = new LoginUseCase(new AuthService());

  @Mutation(() => Token)
  async login(@Arg("data") data: LoginInput): Promise<Token> {
    const token = await this.loginUseCase.execute(data);
    return { accessToken: token };
  }

  @Query(() => User)
  async me(@Ctx() ctx: any): Promise<User | null> {
    return ctx.user || null;
  }
}