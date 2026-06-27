import { FastifyRequest, FastifyReply } from 'fastify';
import { assignmentService } from './assignment.service';
import {
  assignDeliverySchema,
  acceptAssignmentSchema,
  rejectAssignmentSchema,
  reassignDeliverySchema,
} from './assignment.schema';
import { success, error } from '../../shared/utils/api-response';

export class AssignmentController {
  async assignDeliveryHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = assignDeliverySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const assignment = await assignmentService.assignDelivery(
        request.user.userId,
        parsed.data.deliveryId,
        parsed.data.driverId
      );
      return reply.code(201).send(success('Assignment created', assignment));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async reassignDeliveryHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = reassignDeliverySchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const assignment = await assignmentService.reassignDelivery(
        request.user.userId,
        parsed.data.deliveryId,
        parsed.data.driverId
      );
      return reply.code(201).send(success('Reassignment created', assignment));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async acceptAssignmentHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = acceptAssignmentSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const assignment = await assignmentService.acceptAssignment(
        request.user.userId,
        parsed.data.assignmentId
      );
      return reply.code(200).send(success('Assignment accepted', assignment));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async rejectAssignmentHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parsed = rejectAssignmentSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.code(400).send(error('Validation failed', { errors: parsed.error.format() }));
      }

      const assignment = await assignmentService.rejectAssignment(
        request.user.userId,
        parsed.data.assignmentId,
        parsed.data.reason
      );
      return reply.code(200).send(success('Assignment rejected', assignment));
    } catch (err: any) {
      return reply.code(400).send(error(err.message));
    }
  }

  async getActiveAssignmentsHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const assignments = await assignmentService.getActiveAssignments();
      return reply.code(200).send(success('Active assignments retrieved', assignments));
    } catch (err: any) {
      return reply.code(500).send(error(err.message));
    }
  }

  async getAssignmentByDeliveryHandler(request: FastifyRequest<{ Params: { deliveryId: string } }>, reply: FastifyReply) {
    try {
      // In a real scenario, we'd fetch the active assignment. For now we use the history to find it.
      const history = await assignmentService.getAssignmentHistory(request.params.deliveryId);
      if (!history.length) return reply.code(404).send(error('No assignments found for delivery'));
      
      const active = history.find(a => ['ASSIGNMENT_PENDING', 'ASSIGNED', 'DRIVER_ACCEPTED'].includes(a.status));
      return reply.code(200).send(success('Current assignment retrieved', active || history[history.length - 1]));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async getDriverAssignmentsHandler(request: FastifyRequest<{ Params: { driverId: string } }>, reply: FastifyReply) {
    try {
      const assignments = await assignmentService.getDriverActiveAssignments(request.params.driverId);
      return reply.code(200).send(success('Driver assignments retrieved', assignments));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }

  async getAssignmentHistoryHandler(request: FastifyRequest<{ Params: { deliveryId: string } }>, reply: FastifyReply) {
    try {
      const history = await assignmentService.getAssignmentHistory(request.params.deliveryId);
      return reply.code(200).send(success('Assignment history retrieved', history));
    } catch (err: any) {
      return reply.code(404).send(error(err.message));
    }
  }
}

export const assignmentController = new AssignmentController();
