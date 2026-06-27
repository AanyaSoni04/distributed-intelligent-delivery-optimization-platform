/**
 * Dedicated cache abstraction for the Driver Module.
 * All methods are pass-through stubs for now.
 */
export class DriverCache {
  async getCachedLocation(driverId: string) {
    // TODO: Redis get location
    return null;
  }

  async setCachedLocation(driverId: string, location: any) {
    // TODO: Redis set location with TTL
  }
}

export const driverCache = new DriverCache();
