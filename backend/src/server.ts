import Fastify from 'fastify';
import { env } from './config/env';

// Plugins
import errorHandlerPlugin from './plugins/errorHandler';
import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';
import websocketPlugin from './plugins/websocket';

// Routes
import { healthRoutes } from './modules/health/health.routes';

const server = Fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    transport: env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  },
});

// Register Core Plugins
server.register(errorHandlerPlugin);
server.register(prismaPlugin);
server.register(redisPlugin);
server.register(websocketPlugin);

// Register Routes
server.register(healthRoutes, { prefix: '/api' });

const start = async () => {
  try {
    await server.listen({ port: env.PORT, host: env.HOST });
    server.log.info(`Server listening on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
