import { MiddlewareFn } from 'type-graphql';
import { Context } from '../graphql/types/context';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';

export const authMiddleware: MiddlewareFn<Context> = async ({ context }, next) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) {
    throw new Error('Not authenticated');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string };
    const userService = new UserService();
    const user = await userService.getUserById(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    context.user = user;
    return next();
  } catch (error) {
    throw new Error('Not authenticated');
  }
}; 