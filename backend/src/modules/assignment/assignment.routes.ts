import { FastifyPluginAsync } from 'fastify';
import { assignmentController } from './assignment.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

export const assignmentRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // ADMIN only routes
  fastify.register(async (adminRoutes) => {
    adminRoutes.addHook('onRequest', authorize([Role.ADMIN]));
    
    adminRoutes.post('/assign', assignmentController.assignDeliveryHandler.bind(assignmentController));
    adminRoutes.post('/reassign', assignmentController.reassignDeliveryHandler.bind(assignmentController));
    adminRoutes.get('/active', assignmentController.getActiveAssignmentsHandler.bind(assignmentController));
    adminRoutes.get('/history/:deliveryId', assignmentController.getAssignmentHistoryHandler.bind(assignmentController));
  });

  // DRIVER only routes
  fastify.register(async (driverRoutes) => {
    driverRoutes.addHook('onRequest', authorize([Role.DRIVER]));
    
    driverRoutes.post('/accept', assignmentController.acceptAssignmentHandler.bind(assignmentController));
    driverRoutes.post('/reject', assignmentController.rejectAssignmentHandler.bind(assignmentController));
  });

  // Mixed ADMIN and DRIVER routes
  fastify.register(async (mixedRoutes) => {
    mixedRoutes.addHook('onRequest', authorize([Role.ADMIN, Role.DRIVER]));
    
    mixedRoutes.get('/delivery/:deliveryId', assignmentController.getAssignmentByDeliveryHandler.bind(assignmentController));
    mixedRoutes.get('/driver/:driverId', assignmentController.getDriverAssignmentsHandler.bind(assignmentController));
  });
};
