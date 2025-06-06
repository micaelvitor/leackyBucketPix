import { Context, Next } from 'koa';
import { validateTokenUseCase } from '@/application/usecases/validateToken.usecase';

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { message: 'Authentication token not provided or invalid.' };
    return;
  }

  const token = authHeader.split(' ')[1];
  const userSession = await validateTokenUseCase(token);

  if (!userSession) {
    ctx.status = 401;
    ctx.body = { message: 'Authentication token invalid or expired.' };
    return;
  }

  ctx.state.user = userSession;
  await next();
}