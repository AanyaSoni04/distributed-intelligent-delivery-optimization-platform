import { Delivery } from '@prisma/client';

/**
 * Dedicated cache abstraction for the Delivery module.
 *
 * All methods are pass-through stubs for now.
 * When Redis caching is implemented, ONLY this file needs to change.
 * No service or controller modifications will be required.
 */
export class DeliveryCache {
  /**
   * Attempt to retrieve a delivery from cache by ID.
   * TODO: Check Redis first, fall back to null (caller hits DB).
   */
  async getDelivery(deliveryId: string): Promise<Delivery | null> {
    return null;
  }

  /**
   * Store a delivery in cache with appropriate TTL.
   * TODO: Write to Redis with TTL (e.g., 5 minutes).
   */
  async setDelivery(delivery: Delivery): Promise<void> {
    // TODO: Redis SET with TTL
  }

  /**
   * Invalidate a cached delivery (e.g., after status change).
   * TODO: Remove from Redis.
   */
  async invalidateDelivery(deliveryId: string): Promise<void> {
    // TODO: Redis DEL
  }

  /**
   * Attempt to retrieve a delivery from cache by tracking number.
   * TODO: Check Redis by tracking number key.
   */
  async getByTracking(trackingNumber: string): Promise<Delivery | null> {
    return null;
  }
}

export const deliveryCache = new DeliveryCache();
