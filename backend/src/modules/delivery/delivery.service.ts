import { prisma } from '../../plugins/prisma';
import { CreateDeliveryInput, UpdateDeliveryInput } from './delivery.schema';
import { DeliveryStatus, EventSource } from '@prisma/client';
import { isValidTransition, isTerminalStatus } from './delivery.types';
import { deliveryCache } from './delivery.cache';

export class DeliveryService {
  /**
   * Generate a concurrency-safe tracking number using atomic SQL.
   * Format: DID-{YYYY}-{NNNNNN}
   */
  private async generateTrackingNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();

    // Atomic upsert: if year matches, increment counter; if year changed, reset to 1.
    const result = await prisma.$queryRaw<{ lastCounter: number }[]>`
      INSERT INTO "TrackingCounter" (id, year, "lastCounter", "updatedAt")
      VALUES (1, ${currentYear}, 1, NOW())
      ON CONFLICT (id) DO UPDATE
      SET "lastCounter" = CASE
        WHEN "TrackingCounter".year = ${currentYear}
        THEN "TrackingCounter"."lastCounter" + 1
        ELSE 1
      END,
      year = ${currentYear},
      "updatedAt" = NOW()
      RETURNING "lastCounter"
    `;

    const counter = result[0].lastCounter;
    const padded = counter.toString().padStart(6, '0');
    return `DID-${currentYear}-${padded}`;
  }

  async createDelivery(userId: string, customerId: string, data: CreateDeliveryInput) {
    // Idempotency check
    if (data.clientRequestId) {
      const existing = await prisma.delivery.findUnique({
        where: { clientRequestId: data.clientRequestId },
      });
      if (existing) {
        return existing;
      }
    }

    // Validate pickup address belongs to customer and is not deleted
    const pickupAddress = await prisma.address.findFirst({
      where: { id: data.pickupAddressId, customerId, isDeleted: false },
    });
    if (!pickupAddress) {
      throw new Error('Pickup address not found or does not belong to this customer');
    }

    // Validate delivery address belongs to customer and is not deleted
    const deliveryAddress = await prisma.address.findFirst({
      where: { id: data.deliveryAddressId, customerId, isDeleted: false },
    });
    if (!deliveryAddress) {
      throw new Error('Delivery address not found or does not belong to this customer');
    }

    const trackingNumber = await this.generateTrackingNumber();

    const delivery = await prisma.$transaction(async (tx) => {
      const newDelivery = await tx.delivery.create({
        data: {
          trackingNumber,
          clientRequestId: data.clientRequestId,
          customerId,
          pickupAddressId: data.pickupAddressId,
          deliveryAddressId: data.deliveryAddressId,
          packageWeight: data.packageWeight,
          packageLength: data.packageLength,
          packageWidth: data.packageWidth,
          packageHeight: data.packageHeight,
          packageType: data.packageType,
          packageValue: data.packageValue,
          packageDescription: data.packageDescription,
          priorityLevel: data.priorityLevel,
          serviceLevel: data.serviceLevel,
          source: data.source,
          scheduledPickupTime: data.scheduledPickupTime ? new Date(data.scheduledPickupTime) : null,
          specialInstructions: data.specialInstructions,
          createdByUserId: userId,
        },
      });

      // Create first immutable event
      await tx.deliveryEvent.create({
        data: {
          deliveryId: newDelivery.id,
          eventType: 'CREATED',
          previousStatus: null,
          currentStatus: DeliveryStatus.CREATED,
          source: EventSource.CUSTOMER,
          message: `Delivery created with tracking number ${trackingNumber}`,
          createdByUserId: userId,
        },
      });

      // Increment customer delivery metrics
      await tx.customerProfile.update({
        where: { id: customerId },
        data: {
          totalDeliveries: { increment: 1 },
          activeDeliveries: { increment: 1 },
        },
      });

      return newDelivery;
    });

    // TODO: Kafka DeliveryCreated
    return delivery;
  }

  async getDeliveryById(customerId: string, deliveryId: string) {
    // Try cache first
    const cached = await deliveryCache.getDelivery(deliveryId);
    if (cached && cached.customerId === customerId) {
      return cached;
    }

    const delivery = await prisma.delivery.findFirst({
      where: { id: deliveryId, customerId },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    await deliveryCache.setDelivery(delivery);
    return delivery;
  }

  async getCustomerDeliveries(customerId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [deliveries, total] = await Promise.all([
      prisma.delivery.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          pickupAddress: true,
          deliveryAddress: true,
        },
      }),
      prisma.delivery.count({ where: { customerId } }),
    ]);

    return { deliveries, total, page, limit };
  }

  async getDeliveryByTracking(trackingNumber: string) {
    // Try cache first
    const cached = await deliveryCache.getByTracking(trackingNumber);
    if (cached) {
      return cached;
    }

    const delivery = await prisma.delivery.findUnique({
      where: { trackingNumber },
      include: {
        pickupAddress: true,
        deliveryAddress: true,
        events: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    await deliveryCache.setDelivery(delivery);
    return delivery;
  }

  async getDeliveryTimeline(customerId: string, deliveryId: string) {
    // Verify ownership
    const delivery = await prisma.delivery.findFirst({
      where: { id: deliveryId, customerId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    const events = await prisma.deliveryEvent.findMany({
      where: { deliveryId },
      orderBy: { createdAt: 'asc' },
    });

    return events;
  }

  async updateDelivery(userId: string, customerId: string, deliveryId: string, data: UpdateDeliveryInput) {
    const delivery = await prisma.delivery.findFirst({
      where: { id: deliveryId, customerId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (isTerminalStatus(delivery.status)) {
      throw new Error(`Cannot update delivery in ${delivery.status} status`);
    }

    // If status change requested, validate the transition
    if (data.status && data.status !== delivery.status) {
      if (!isValidTransition(delivery.status, data.status)) {
        throw new Error(`Invalid status transition: ${delivery.status} → ${data.status}`);
      }
    }

    const { status, ...updateFields } = data;

    const updatedDelivery = await prisma.$transaction(async (tx) => {
      const updateData: any = { ...updateFields };

      if (data.scheduledPickupTime) {
        updateData.scheduledPickupTime = new Date(data.scheduledPickupTime);
      }

      if (status && status !== delivery.status) {
        updateData.status = status;

        // Set actualDeliveryTime when delivered
        if (status === DeliveryStatus.DELIVERED) {
          updateData.actualDeliveryTime = new Date();
        }

        // Create immutable status change event
        await tx.deliveryEvent.create({
          data: {
            deliveryId,
            eventType: 'STATUS_CHANGE',
            previousStatus: delivery.status,
            currentStatus: status,
            source: EventSource.CUSTOMER,
            message: `Status changed from ${delivery.status} to ${status}`,
            createdByUserId: userId,
          },
        });

        // If reaching a terminal delivery state, decrement active count
        if (isTerminalStatus(status)) {
          await tx.customerProfile.update({
            where: { id: customerId },
            data: { activeDeliveries: { decrement: 1 } },
          });
        }
      }

      return tx.delivery.update({
        where: { id: deliveryId },
        data: updateData,
      });
    });

    await deliveryCache.invalidateDelivery(deliveryId);

    // TODO: Kafka DeliveryUpdated
    // TODO: WebSocket live tracking notification
    return updatedDelivery;
  }

  async cancelDelivery(userId: string, customerId: string, deliveryId: string) {
    const delivery = await prisma.delivery.findFirst({
      where: { id: deliveryId, customerId },
    });

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (isTerminalStatus(delivery.status)) {
      throw new Error(`Cannot cancel delivery in ${delivery.status} status`);
    }

    if (!isValidTransition(delivery.status, DeliveryStatus.CANCELLED)) {
      throw new Error(`Cannot cancel delivery in ${delivery.status} status`);
    }

    const cancelledDelivery = await prisma.$transaction(async (tx) => {
      await tx.deliveryEvent.create({
        data: {
          deliveryId,
          eventType: 'CANCELLED',
          previousStatus: delivery.status,
          currentStatus: DeliveryStatus.CANCELLED,
          source: EventSource.CUSTOMER,
          message: 'Delivery cancelled by customer',
          createdByUserId: userId,
        },
      });

      await tx.customerProfile.update({
        where: { id: customerId },
        data: { activeDeliveries: { decrement: 1 } },
      });

      return tx.delivery.update({
        where: { id: deliveryId },
        data: { status: DeliveryStatus.CANCELLED },
      });
    });

    await deliveryCache.invalidateDelivery(deliveryId);

    // TODO: Kafka DeliveryCancelled
    return cancelledDelivery;
  }
}

export const deliveryService = new DeliveryService();
