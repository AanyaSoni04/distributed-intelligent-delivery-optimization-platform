import { FastifyPluginAsync } from 'fastify';
import { driverController } from './driver.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { Role } from '@prisma/client';

export const driverRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', authenticate);

  // DRIVER only routes
  fastify.register(async (driverRoutes) => {
    driverRoutes.addHook('onRequest', authorize([Role.DRIVER]));
    
    driverRoutes.post('/register', driverController.registerDriverHandler.bind(driverController));
    driverRoutes.get('/me', driverController.getMyProfileHandler.bind(driverController));
    driverRoutes.put('/profile', driverController.updateProfileHandler.bind(driverController));
    driverRoutes.patch('/availability', driverController.updateAvailabilityHandler.bind(driverController));
    driverRoutes.patch('/working-status', driverController.updateWorkingStatusHandler.bind(driverController));
    driverRoutes.patch('/location', driverController.updateLocationHandler.bind(driverController));
    driverRoutes.patch('/online', driverController.setOnlineHandler.bind(driverController));
    driverRoutes.patch('/offline', driverController.setOfflineHandler.bind(driverController));
  });

  // ADMIN only routes
  fastify.register(async (adminRoutes) => {
    adminRoutes.addHook('onRequest', authorize([Role.ADMIN]));
    
    adminRoutes.get('/eligible', driverController.getEligibleDriversHandler.bind(driverController));
    adminRoutes.get('/:id', driverController.getDriverByIdHandler.bind(driverController));
    adminRoutes.get('/:id/location/history', driverController.getLocationHistoryHandler.bind(driverController));
  });
};
