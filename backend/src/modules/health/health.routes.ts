import { FastifyPluginAsync } from 'fastify';

export const healthRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async (request, reply) => {
    try {
      // Check database connection
      await fastify.prisma.$queryRaw`SELECT 1`;
      
      // Check redis connection
      await fastify.redis.ping();

      return reply.send({
        status: 'ok',
        database: 'connected',
        redis: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      fastify.log.error('Health check failed', error);
      return reply.status(503).send({
        status: 'error',
        message: 'Service Unavailable',
        timestamp: new Date().toISOString(),
      });
    }
  });
};
