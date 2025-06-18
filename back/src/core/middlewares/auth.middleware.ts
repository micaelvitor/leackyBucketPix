import { MiddlewareFn } from 'type-graphql';
import jwt from 'jsonwebtoken';
import { MyContext } from '@/api/types/context.type';

export const authMiddleware: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const authHeader = context.token;
  if (!authHeader) throw new Error('Not authenticated');

  const token = authHeader.split(' ')[1];
  if (!token) throw new Error('Not authenticated');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string };

    const userDocument = await context.services.userService.getUserById(decoded.id);
    if (!userDocument) throw new Error('User not found');

    context.user = userDocument;
    return next();
  } catch (error) {
    console.error('Auth Middleware error:', error);
    throw new Error('Not authenticated');
  }
};