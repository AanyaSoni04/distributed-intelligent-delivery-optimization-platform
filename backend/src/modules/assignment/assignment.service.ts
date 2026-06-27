import { prisma } from '../../plugins/prisma';
import { AssignmentStatus, AssignmentReason, EventSource, AssignmentEventType } from '@prisma/client';
import { deliveryLifecycleService } from '../../shared/services/delivery-lifecycle.service';
import { FirstEligibleStrategy } from './assignment.strategy';
import { assignmentCache } from './assignment.cache';
import { DriverModuleProvider } from '../driver/driver-provider';

// Phase 1 providers/strategies
const driverProvider = new DriverModuleProvider();
const assignmentStrategy = new FirstEligibleStrategy();

export class AssignmentService {
  /**
   * Triggers a new assignment for a delivery.
   */
  async assignDelivery(userId: string, deliveryId: string, driverId?: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (
      delivery.assignmentStatus !== AssignmentStatus.UNASSIGNED &&
      delivery.assignmentStatus !== AssignmentStatus.REASSIGNMENT_REQUIRED
    ) {
      throw new Error(`Cannot assign delivery in ${delivery.assignmentStatus} state`);
    }

    const reason = driverId ? AssignmentReason.MANUAL : AssignmentReason.AUTO;
    return this.createAssignmentInternal(userId, deliveryId, driverId, 1, reason);
  }

  /**
   * Re-triggers assignment after a rejection or cancellation.
   */
  async reassignDelivery(userId: string, deliveryId: string, driverId?: string) {
    const delivery = await prisma.delivery.findUnique({
      where: { id: deliveryId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (
      delivery.assignmentStatus !== AssignmentStatus.DRIVER_REJECTED &&
      delivery.assignmentStatus !== AssignmentStatus.REASSIGNMENT_REQUIRED
    ) {
      throw new Error(`Cannot reassign delivery in ${delivery.assignmentStatus} state`);
    }

    // Determine next attempt number
    const previousAssignments = await prisma.assignment.count({
      where: { deliveryId },
    });
    const attemptNumber = previousAssignments + 1;

    return this.createAssignmentInternal(userId, deliveryId, driverId, attemptNumber, AssignmentReason.REASSIGNMENT);
  }

  /**
   * Shared internal method to create an assignment.
   * Uses row-level locking and Serializable transaction.
   */
  private async createAssignmentInternal(
    userId: string,
    deliveryId: string,
    requestedDriverId: string | undefined,
    attemptNumber: number,
    reason: AssignmentReason
  ) {
    return prisma.$transaction(
      async (tx) => {
        // 1. Row-level lock on Delivery to prevent concurrent assignment attempts
        const lockedDeliveries = await tx.$queryRaw<{ id: string }[]>`
          SELECT id FROM "Delivery" WHERE id = ${deliveryId}::uuid FOR UPDATE
        `;

        if (!lockedDeliveries.length) {
          throw new Error('Delivery not found during lock acquisition');
        }

        // 2. Verify no active assignment exists
        const activeAssignment = await tx.assignment.findFirst({
          where: {
            deliveryId,
            status: {
              in: [AssignmentStatus.ASSIGNMENT_PENDING, AssignmentStatus.ASSIGNED, AssignmentStatus.DRIVER_ACCEPTED],
            },
          },
        });

        if (activeAssignment) {
          throw new Error('An active assignment already exists for this delivery');
        }

        // 3. Select driver
        let finalDriverId: string | null = null;
        let finalScore: number | null = null;
        let finalStrategy = 'Manual';

        if (requestedDriverId) {
          finalDriverId = requestedDriverId;
          finalScore = 100.0;
        } else {
          const candidate = await assignmentStrategy.selectDriver(deliveryId, driverProvider);
          if (candidate) {
            finalDriverId = candidate.driverId;
            finalScore = candidate.score;
            finalStrategy = assignmentStrategy.name;
          }
        }

        if (!finalDriverId) {
          // If no driver found, we cannot create an assignment.
          // For now, we'll throw. A future improvement might mark delivery as REASSIGNMENT_REQUIRED
          // and let a background worker try again later.
          throw new Error('No eligible drivers found');
        }

        // TODO: Driver Assignment Lock Extension Points
        // - driver capacity check
        // - maximum active deliveries check
        // - vehicle capacity check
        // - driver availability check

        // 4. Create Assignment
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
        const assignment = await tx.assignment.create({
          data: {
            deliveryId,
            driverId: finalDriverId,
            status: AssignmentStatus.ASSIGNED,
            reason,
            strategyUsed: finalStrategy,
            assignmentScore: finalScore,
            attemptNumber,
            assignedAt: new Date(),
            expiresAt,
            assignedByUserId: userId,
          },
        });

        // 5. Create immutable AssignmentEvent
        await tx.assignmentEvent.create({
          data: {
            assignmentId: assignment.id,
            sequenceNumber: 1,
            eventType: AssignmentEventType.CREATED,
            previousStatus: null,
            currentStatus: AssignmentStatus.ASSIGNED,
            source: EventSource.SYSTEM,
            message: `Assignment created using strategy: ${finalStrategy}`,
            metadata: {
              strategy: finalStrategy,
              score: finalScore,
              reason: reason,
            },
            createdByUserId: userId,
          },
        });

        // 6. Update Delivery via lifecycle service
        await deliveryLifecycleService.assignDriver(tx, deliveryId, finalDriverId, userId);

        return assignment;
      },
      {
        isolationLevel: 'Serializable',
      }
    );

    // TODO: Kafka AssignmentCreated
    // TODO: WebSocket DriverAssigned
  }

  /**
   * Driver accepts the assignment.
   */
  async acceptAssignment(userId: string, assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.ASSIGNED) {
      throw new Error(`Cannot accept assignment in ${assignment.status} state`);
    }

    // TODO: Validate driver lock / capacity again just before accepting

    return prisma.$transaction(async (tx) => {
      // Get next sequence number
      const prevEventsCount = await tx.assignmentEvent.count({ where: { assignmentId } });

      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          status: AssignmentStatus.DRIVER_ACCEPTED,
          acceptedAt: new Date(),
          acceptedByUserId: userId,
        },
      });

      await tx.assignmentEvent.create({
        data: {
          assignmentId,
          sequenceNumber: prevEventsCount + 1,
          eventType: AssignmentEventType.ACCEPTED,
          previousStatus: AssignmentStatus.ASSIGNED,
          currentStatus: AssignmentStatus.DRIVER_ACCEPTED,
          source: EventSource.DRIVER,
          message: 'Driver accepted the assignment',
          createdByUserId: userId,
        },
      });

      await deliveryLifecycleService.driverAccepted(tx, assignment.deliveryId, userId);
      await deliveryLifecycleService.moveToPickupPending(tx, assignment.deliveryId, userId);

      return updatedAssignment;
    });

    // TODO: Kafka DriverAccepted
    // TODO: WebSocket DriverAccepted
  }

  /**
   * Driver rejects the assignment.
   */
  async rejectAssignment(userId: string, assignmentId: string, reason?: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (assignment.status !== AssignmentStatus.ASSIGNED) {
      throw new Error(`Cannot reject assignment in ${assignment.status} state`);
    }

    return prisma.$transaction(async (tx) => {
      const prevEventsCount = await tx.assignmentEvent.count({ where: { assignmentId } });

      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          status: AssignmentStatus.DRIVER_REJECTED,
          rejectedAt: new Date(),
          rejectedByUserId: userId,
        },
      });

      await tx.assignmentEvent.create({
        data: {
          assignmentId,
          sequenceNumber: prevEventsCount + 1,
          eventType: AssignmentEventType.REJECTED,
          previousStatus: AssignmentStatus.ASSIGNED,
          currentStatus: AssignmentStatus.DRIVER_REJECTED,
          source: EventSource.DRIVER,
          message: reason || 'Driver rejected the assignment',
          metadata: reason ? { rejectionReason: reason } : undefined,
          createdByUserId: userId,
        },
      });

      await deliveryLifecycleService.driverRejected(tx, assignment.deliveryId, userId);

      return updatedAssignment;
    });

    // TODO: Kafka DriverRejected
    // TODO: WebSocket DriverRejected
  }

  /**
   * Admin cancels the active assignment, putting it back to reassignment required.
   */
  async cancelAssignment(userId: string, assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    if (
      assignment.status !== AssignmentStatus.ASSIGNED &&
      assignment.status !== AssignmentStatus.ASSIGNMENT_PENDING
    ) {
      throw new Error(`Cannot cancel assignment in ${assignment.status} state`);
    }

    return prisma.$transaction(async (tx) => {
      const prevEventsCount = await tx.assignmentEvent.count({ where: { assignmentId } });

      const updatedAssignment = await tx.assignment.update({
        where: { id: assignmentId },
        data: {
          status: AssignmentStatus.REASSIGNMENT_REQUIRED,
        },
      });

      await tx.assignmentEvent.create({
        data: {
          assignmentId,
          sequenceNumber: prevEventsCount + 1,
          eventType: AssignmentEventType.CANCELLED,
          previousStatus: assignment.status,
          currentStatus: AssignmentStatus.REASSIGNMENT_REQUIRED,
          source: EventSource.ADMIN,
          message: 'Assignment cancelled by admin',
          createdByUserId: userId,
        },
      });

      await deliveryLifecycleService.driverRejected(tx, assignment.deliveryId, userId);

      return updatedAssignment;
    });

    // TODO: Kafka AssignmentCancelled
    // TODO: WebSocket AssignmentExpired (or cancelled)
  }

  async getAssignment(assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        events: { orderBy: { sequenceNumber: 'asc' } },
        delivery: true,
      },
    });

    if (!assignment) throw new Error('Assignment not found');
    return assignment;
  }

  async getActiveAssignments() {
    return prisma.assignment.findMany({
      where: {
        status: {
          in: [AssignmentStatus.ASSIGNMENT_PENDING, AssignmentStatus.ASSIGNED, AssignmentStatus.DRIVER_ACCEPTED],
        },
      },
      include: { delivery: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAssignmentHistory(deliveryId: string) {
    return prisma.assignment.findMany({
      where: { deliveryId },
      include: {
        events: { orderBy: { sequenceNumber: 'asc' } },
      },
      orderBy: { attemptNumber: 'asc' },
    });
  }

  async getDriverActiveAssignments(driverId: string) {
    return prisma.assignment.findMany({
      where: {
        driverId,
        status: {
          in: [AssignmentStatus.ASSIGNED, AssignmentStatus.DRIVER_ACCEPTED],
        },
      },
      include: { delivery: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const assignmentService = new AssignmentService();
