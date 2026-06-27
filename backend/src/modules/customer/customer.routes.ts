import { FastifyPluginAsync } from 'fastify';
import { customerController } from './customer.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

export const customerRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes here require authentication and CUSTOMER role
  fastify.addHook('onRequest', authenticate);
  fastify.addHook('onRequest', authorize([Role.CUSTOMER]));

  // Profile Routes
  fastify.get('/profile', customerController.getProfileHandler.bind(customerController));
  fastify.put('/profile', customerController.updateProfileHandler.bind(customerController));

  // Address Routes
  fastify.get('/addresses', customerController.getAddressesHandler.bind(customerController));
  fastify.get('/addresses/search', customerController.searchAddressesHandler.bind(customerController));
  fastify.get('/addresses/:id', customerController.getAddressByIdHandler.bind(customerController));

  fastify.post('/addresses', customerController.createAddressHandler.bind(customerController));
  fastify.put('/addresses/:id', customerController.updateAddressHandler.bind(customerController));
  fastify.delete('/addresses/:id', customerController.deleteAddressHandler.bind(customerController));

  fastify.patch('/addresses/:id/default', customerController.setDefaultAddressHandler.bind(customerController));
};
