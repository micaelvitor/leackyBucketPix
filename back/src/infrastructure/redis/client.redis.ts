import { Redis } from 'ioredis';

let instance: Redis;

export const getRedisClient = (): Redis => {
  if (!instance) {
    instance = new Redis({
      maxRetriesPerRequest: null,
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  return instance;
};