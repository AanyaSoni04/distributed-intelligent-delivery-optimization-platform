import { Prisma, DeliveryStatus, AssignmentStatus, EventSource } from '@prisma/client';

export class DeliveryLifecycleService {
  /**
   * Updates a delivery to ASSIGNED and sets the driver.
   * This is called when an assignment is successfully created.
   */
  async assignDriver(
    tx: Prisma.TransactionClient,
    deliveryId: string,
    driverId: string,
    userId: string
  ): Promise<void> {
    await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        driverId,
        assignmentStatus: AssignmentStatus.ASSIGNED,
      },
    });

    await this.appendDeliveryEvent(tx, {
      deliveryId,
      eventType: 'ASSIGNMENT_CREATED',
      currentStatus: DeliveryStatus.CREATED,
      source: EventSource.SYSTEM,
      message: `Delivery assigned to driver ${driverId}`,
      createdByUserId: userId,
    });
  }

  /**
   * Transitions assignment status to DRIVER_ACCEPTED.
   */
  async driverAccepted(
    tx: Prisma.TransactionClient,
    deliveryId: string,
    userId: string
  ): Promise<void> {
    await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        assignmentStatus: AssignmentStatus.DRIVER_ACCEPTED,
      },
    });

    await this.appendDeliveryEvent(tx, {
      deliveryId,
      eventType: 'ASSIGNMENT_ACCEPTED',
      currentStatus: DeliveryStatus.CREATED,
      source: EventSource.DRIVER,
      message: 'Driver accepted the assignment',
      createdByUserId: userId,
    });
  }

  /**
   * Transitions assignment status to REASSIGNMENT_REQUIRED and clears driverId.
   */
  async driverRejected(
    tx: Prisma.TransactionClient,
    deliveryId: string,
    userId: string
  ): Promise<void> {
    await tx.delivery.update({
      where: { id: deliveryId },
      data: {
        driverId: null,
        assignmentStatus: AssignmentStatus.REASSIGNMENT_REQUIRED,
      },
    });

    await this.appendDeliveryEvent(tx, {
      deliveryId,
      eventType: 'ASSIGNMENT_REJECTED',
      currentStatus: DeliveryStatus.CREATED,
      source: EventSource.DRIVER,
      message: 'Driver rejected the assignment',
      createdByUserId: userId,
    });
  }

  /**
   * Transitions delivery status from CREATED to PICKUP_PENDING.
   * Typically called right after a driver accepts the assignment.
   */
  async moveToPickupPending(
    tx: Prisma.TransactionClient,
    deliveryId: string,
    userId: string
  ): Promise<void> {
    const delivery = await tx.delivery.findUnique({
      where: { id: deliveryId },
      select: { status: true },
    });

    if (!delivery || delivery.status !== DeliveryStatus.CREATED) {
      throw new Error('Delivery must be in CREATED state to move to PICKUP_PENDING');
    }

    await tx.delivery.update({
      where: { id: deliveryId },
      data: { status: DeliveryStatus.PICKUP_PENDING },
    });

    await this.appendDeliveryEvent(tx, {
      deliveryId,
      eventType: 'STATUS_CHANGE',
      previousStatus: DeliveryStatus.CREATED,
      currentStatus: DeliveryStatus.PICKUP_PENDING,
      source: EventSource.SYSTEM,
      message: 'Status changed from CREATED to PICKUP_PENDING',
      createdByUserId: userId,
    });
  }

  /**
   * Appends an immutable event to the Delivery history.
   */
  async appendDeliveryEvent(
    tx: Prisma.TransactionClient,
    data: {
      deliveryId: string;
      eventType: string;
      previousStatus?: DeliveryStatus;
      currentStatus: DeliveryStatus;
      source: EventSource;
      message: string;
      createdByUserId: string;
    }
  ): Promise<void> {
    await tx.deliveryEvent.create({
      data: {
        deliveryId: data.deliveryId,
        eventType: data.eventType,
        previousStatus: data.previousStatus,
        currentStatus: data.currentStatus,
        source: data.source,
        message: data.message,
        createdByUserId: data.createdByUserId,
      },
    });
  }
}

export const deliveryLifecycleService = new DeliveryLifecycleService();
