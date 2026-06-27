import { FastifyPluginAsync } from 'fastify';
import { deliveryController } from './delivery.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

/**
 * Customer-facing delivery routes.
 * All routes require authentication and CUSTOMER role.
 */
export const deliveryRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);
  fastify.addHook('onRequest', authorize([Role.CUSTOMER]));

  fastify.post('/', deliveryController.createDeliveryHandler.bind(deliveryController));
  fastify.get('/', deliveryController.getDeliveriesHandler.bind(deliveryController));
  fastify.get('/:id', deliveryController.getDeliveryByIdHandler.bind(deliveryController));
  fastify.patch('/:id', deliveryController.updateDeliveryHandler.bind(deliveryController));
  fastify.delete('/:id', deliveryController.cancelDeliveryHandler.bind(deliveryController));
  fastify.get('/:id/timeline', deliveryController.getDeliveryTimelineHandler.bind(deliveryController));
};

/**
 * Public tracking route.
 * Requires authentication but does NOT enforce customer ownership.
 * Any authenticated user can look up a delivery by tracking number.
 */
export const trackingRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  fastify.get('/:trackingNumber', deliveryController.getDeliveryByTrackingHandler.bind(deliveryController));
};
