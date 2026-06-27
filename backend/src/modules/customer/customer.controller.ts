import { FastifyRequest, FastifyReply } from 'fastify';
import { customerService } from './customer.service';
import { updateProfileSchema, createAddressSchema, updateAddressSchema, paginationQuerySchema, searchQuerySchema } from './customer.schema';
import { success, error } from '../../shared/utils/api-response';

export class CustomerController {
  
  // -- PROFILE --

  async getProfileHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const profile = await customerService.getProfile(request.user.userId);
      if (!profile) {
        return reply.code(404).send(error('Customer profile not found'));
      }
      return reply.code(200).send(success('Profile retrieved', profile));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }

  async updateProfileHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsedBody = updateProfileSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsedBody.error.format() }));
      }

      const profile = await customerService.upsertProfile(request.user.userId, parsedBody.data);
      return reply.code(200).send(success('Profile updated successfully', profile));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  // -- ADDRESSES --

  private async getCustomerId(userId: string): Promise<string | null> {
    const profile = await customerService.getProfile(userId);
    return profile ? profile.id : null;
  }

  async getAddressesHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const query = paginationQuerySchema.safeParse(request.query);
      if (!query.success) {
        return reply.code(400).send(error('Invalid pagination parameters'));
      }

      const { page, limit } = query.data;
      const result = await customerService.getAddresses(customerId, page, limit);
      
      return reply.code(200).send(success('Addresses retrieved', result));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }

  async searchAddressesHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const query = searchQuerySchema.safeParse(request.query);
      if (!query.success) {
        return reply.code(400).send(error('Invalid search parameters'));
      }

      const { q, page, limit } = query.data;
      if (!q) {
        const result = await customerService.getAddresses(customerId, page, limit);
        return reply.code(200).send(success('Addresses retrieved', result));
      }

      const result = await customerService.searchAddresses(customerId, q, page, limit);
      return reply.code(200).send(success('Addresses searched', result));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }

  async getAddressByIdHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const address = await customerService.getAddressById(customerId, request.params.id);
      return reply.code(200).send(success('Address retrieved', address));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async createAddressHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const parsedBody = createAddressSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsedBody.error.format() }));
      }

      const address = await customerService.createAddress(request.user.userId, customerId, parsedBody.data);
      return reply.code(201).send(success('Address created successfully', address));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async updateAddressHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const parsedBody = updateAddressSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsedBody.error.format() }));
      }

      const address = await customerService.updateAddress(request.user.userId, customerId, request.params.id, parsedBody.data);
      return reply.code(200).send(success('Address updated successfully', address));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async deleteAddressHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      await customerService.deleteAddress(request.user.userId, customerId, request.params.id);
      return reply.code(200).send(success('Address deleted successfully', null));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async setDefaultAddressHandler(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const customerId = await this.getCustomerId(request.user.userId);
      if (!customerId) return reply.code(404).send(error('Customer profile not found'));

      const address = await customerService.setDefaultAddress(request.user.userId, customerId, request.params.id);
      return reply.code(200).send(success('Default address updated successfully', address));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }
}

export const customerController = new CustomerController();
