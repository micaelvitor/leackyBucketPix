import { Queue, Worker } from 'bullmq';
import { getRedisClient } from '@/infrastructure/redis/client.redis';

const connection = getRedisClient();

export const QUEUE_NAMES = {
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  PIX_KEY_CREATED: 'pixKey.created',
  PIX_KEY_DELETED: 'pixKey.deleted',
} as const;

export const createQueue = (name: string) => {
  return new Queue(name, { connection });
};

export const createWorker = (name: string, processor: any) => {
  return new Worker(name, processor, { connection });
};

export const queues = {
  userCreated: createQueue(QUEUE_NAMES.USER_CREATED),
  userUpdated: createQueue(QUEUE_NAMES.USER_UPDATED),
  userDeleted: createQueue(QUEUE_NAMES.USER_DELETED),
  pixKeyCreated: createQueue(QUEUE_NAMES.PIX_KEY_CREATED),
  pixKeyDeleted: createQueue(QUEUE_NAMES.PIX_KEY_DELETED),
}; 