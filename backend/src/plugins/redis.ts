import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';
import { env } from '../config/env';

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

const redisPlugin: FastifyPluginAsync = async (fastify, options) => {
  const redis = new Redis(env.REDIS_URL);

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async (server) => {
    await server.redis.quit();
  });
};

export default fp(redisPlugin);
