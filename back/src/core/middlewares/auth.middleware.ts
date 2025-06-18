import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { MyContext } from '@/api/types/context.type';
import { userResolveQueue } from '@/infrastructure/queue/queues';

export const authMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authHeader = context.token;
  if (!authHeader) throw new Error('Not authenticated');

  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Not authenticated');
  //todo work wirt bullmq
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string };
    if (!decoded?.id) throw new Error('Invalid token');
    const job = await userResolveQueue.add('user:resolve', { id: decoded.id });
    const userData = await job.waitUntilFinished();
    if (!userData) throw new Error('User not found');
    context.user = userData;
    return next();
  } catch (error) {
    console.error('Auth Middleware error:', error);
    throw new Error('Not authenticated');
  }
};
