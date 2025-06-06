import { Redis } from 'ioredis';
import { Context, Next } from 'koa';

const MAX_REQUESTS_PER_WINDOW = 10;
const WINDOW_DURATION_SECONDS = 60 * 60; 
const BAN_DURATION_SECONDS = 60 * 60;

const RATE_LIMIT_KEY_PREFIX = 'rate_limit';
const BANNED_KEY_PREFIX = 'banned';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
});

redis.on('error', (err: Error) => {
  console.error('Error connecting to Redis for Leaky Bucket Limiter:', err);
  return async (next: Next) => {
    await next();
  };
});

export function createLeakyBucketMiddleware() {
  return async (ctx: Context, next: Next) => {
    const ip = ctx.request.ip;
    const requestCountKey = `${RATE_LIMIT_KEY_PREFIX}:count:${ip}`;
    const bannedKey = `${RATE_LIMIT_KEY_PREFIX}:${BANNED_KEY_PREFIX}:${ip}`;

    try {
      const isBanned = await redis.get(bannedKey);
      if (isBanned) {
        ctx.status = 429;
        ctx.body = {
          message: 'You exceeded the request limit and have been temporarily banned. Please try again later.',
          retryAfter: BAN_DURATION_SECONDS,
        };
        console.warn(`IP ${ip} banned from accessing. Request denied.`);
        return;
      }

      const requestCount = await redis.incr(requestCountKey);
      if (requestCount === 1) {
        await redis.expire(requestCountKey, WINDOW_DURATION_SECONDS);
      }

      if (requestCount > MAX_REQUESTS_PER_WINDOW) {
        await redis.setex(bannedKey, BAN_DURATION_SECONDS, 'true');
        ctx.status = 429;
        ctx.body = {
          message: 'You exceeded the request limit. Your IP has been temporarily banned for 1 hour.',
          retryAfter: BAN_DURATION_SECONDS,
        };
        console.warn(`IP ${ip} exceeded ${MAX_REQUESTS_PER_WINDOW} requests in ${WINDOW_DURATION_SECONDS / 60} minutes. BANNED!`);
        return;
      }

      await next();

    } catch (error) {
      console.error(`❌ Unexpected error in Rate Limiting middleware for IP ${ip}:`, error);
      // In case of Redis failure or other internal middleware errors,
      // @tODO  OPEN TELEMETRY LOGGING
      await next();
    }
  };
}