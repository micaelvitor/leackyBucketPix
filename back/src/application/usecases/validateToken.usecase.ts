import { Redis } from 'ioredis';
import { AuthService, AuthPayload } from '@/application/services/auth/auth.service';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
});

const SESSION_KEY_PREFIX = 'session';
const SESSION_DURATION_SECONDS = 60 * 60;

const authService = new AuthService();

export async function validateTokenUseCase(token: string): Promise<AuthPayload | null> {
  const sessionKey = `${SESSION_KEY_PREFIX}:${token}`;
  const cached = await redis.get(sessionKey);

  if (cached) {
    const userData = JSON.parse(cached) as AuthPayload;
    await redis.expire(sessionKey, SESSION_DURATION_SECONDS);
    return userData;
  }
  
  const decoded = authService.verifyToken(token);

  if (decoded) {
    await redis.setex(sessionKey, SESSION_DURATION_SECONDS, JSON.stringify(decoded));
    return decoded;
  }

  return null;
}