import Fastify from 'fastify';
import { env } from './config/env';
import fastifyJwt from '@fastify/jwt';

// Plugins
import errorHandlerPlugin from './plugins/errorHandler';
import prismaPlugin from './plugins/prisma';
import redisPlugin from './plugins/redis';
import websocketPlugin from './plugins/websocket';

// Routes
import { healthRoutes } from './modules/health/health.routes';
import { authRoutes } from './modules/auth/auth.routes';

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

// Register Auth Plugin
server.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

// Register Routes
import { customerRoutes } from './modules/customer/customer.routes';
import { deliveryRoutes, trackingRoutes } from './modules/delivery/delivery.routes';

server.register(healthRoutes, { prefix: '/api' });
server.register(authRoutes, { prefix: '/api/auth' });
server.register(customerRoutes, { prefix: '/api/customer' });
server.register(deliveryRoutes, { prefix: '/api/deliveries' });
server.register(trackingRoutes, { prefix: '/api/tracking' });

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
