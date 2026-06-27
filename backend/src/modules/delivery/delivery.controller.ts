import { FastifyRequest, FastifyReply } from 'fastify';
import { deliveryService } from './delivery.service';
import { createDeliverySchema, updateDeliverySchema, paginationQuerySchema } from './delivery.schema';
import { success, error } from '../../shared/utils/api-response';
import { prisma } from '../../plugins/prisma';

export class DeliveryController {
  /**
   * Resolve the CustomerProfile ID from the JWT userId.
   * Returns null if no profile exists.
   */
  private async getCustomerId(userId: string): Promise<string | null> {
    const profile = await prisma.customerProfile.findUnique({ where: { userId } });
    return profile ? profile.id : null;
  }

  async createDeliveryHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const parsed = createDeliverySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const delivery = await deliveryService.createDelivery(request.user.userId, customerId, parsed.data);
      return reply.code(201).send(success('Delivery created successfully', delivery));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getDeliveriesHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const query = paginationQuerySchema.safeParse(request.query);
      if (!query.success) {
        return reply.code(400).send(error('Invalid pagination parameters'));
      }

      const result = await deliveryService.getCustomerDeliveries(customerId, query.data.page, query.data.limit);
      return reply.code(200).send(success('Deliveries retrieved', result));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }

  async getDeliveryByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const delivery = await deliveryService.getDeliveryById(customerId, request.params.id);
      return reply.code(200).send(success('Delivery retrieved', delivery));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async updateDeliveryHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const parsed = updateDeliverySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const delivery = await deliveryService.updateDelivery(request.user.userId, customerId, request.params.id, parsed.data);
      return reply.code(200).send(success('Delivery updated successfully', delivery));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async cancelDeliveryHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const delivery = await deliveryService.cancelDelivery(request.user.userId, customerId, request.params.id);
      return reply.code(200).send(success('Delivery cancelled successfully', delivery));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getDeliveryTimelineHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const events = await deliveryService.getDeliveryTimeline(customerId, request.params.id);
      return reply.code(200).send(success('Delivery timeline retrieved', events));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async getDeliveryByTrackingHandler(request: FastifyRequest<{ Params: { trackingNumber: string } }>, reply: FastifyReply) {
    try {
      const delivery = await deliveryService.getDeliveryByTracking(request.params.trackingNumber);
      return reply.code(200).send(success('Delivery retrieved', delivery));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }
}

export const deliveryController = new DeliveryController();
