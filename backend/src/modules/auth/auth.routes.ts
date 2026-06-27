import { FastifyPluginAsync } from 'fastify';
import { authController } from './auth.controller';
import { authenticate } from './auth.middleware';

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/register', authController.registerHandler);
  fastify.post('/login', authController.loginHandler);

  // Protected routes
  fastify.register(async (protectedRoutes) => {
    protectedRoutes.addHook('onRequest', authenticate);
    protectedRoutes.get('/me', authController.meHandler);
  });
};
