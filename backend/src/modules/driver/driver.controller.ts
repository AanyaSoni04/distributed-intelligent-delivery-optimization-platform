import { FastifyRequest, FastifyReply } from 'fastify';
import { driverService } from './driver.service';
import {
  registerDriverSchema,
  updateProfileSchema,
  updateAvailabilitySchema,
  updateWorkingStatusSchema,
  updateLocationSchema
} from './driver.schema';
import { success, error } from '../../shared/utils/api-response';

export class DriverController {
  async registerDriverHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = registerDriverSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const driver = await driverService.createDriver(request.user.userId, parsed.data);
      return reply.code(201).send(success('Driver registered successfully', driver));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getMyProfileHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const profile = await driverService.getDriverByUserId(request.user.userId);
      return reply.code(200).send(success('Profile retrieved', profile));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async getDriverByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const profile = await driverService.getDriverById(request.params.id);
      return reply.code(200).send(success('Profile retrieved', profile));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async updateProfileHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = updateProfileSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const profile = await driverService.updateDriver(request.user.userId, parsed.data);
      return reply.code(200).send(success('Profile updated', profile));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async updateAvailabilityHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = updateAvailabilitySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const profile = await driverService.updateAvailability(request.user.userId, parsed.data);
      return reply.code(200).send(success('Availability updated', profile));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async updateWorkingStatusHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = updateWorkingStatusSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const profile = await driverService.updateWorkingStatus(request.user.userId, parsed.data);
      return reply.code(200).send(success('Working status updated', profile));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async updateLocationHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = updateLocationSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      await driverService.updateLocation(request.user.userId, parsed.data);
      return reply.code(200).send(success('Location updated'));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async setOnlineHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      await driverService.setOnline(request.user.userId);
      return reply.code(200).send(success('Status set to online'));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async setOfflineHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      await driverService.setOffline(request.user.userId);
      return reply.code(200).send(success('Status set to offline'));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getLocationHistoryHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const history = await driverService.getLocationHistory(request.params.id);
      return reply.code(200).send(success('Location history retrieved', history));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getEligibleDriversHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const eligible = await driverService.getEligibleDrivers();
      return reply.code(200).send(success('Eligible drivers retrieved', eligible));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }
}

export const driverController = new DriverController();
