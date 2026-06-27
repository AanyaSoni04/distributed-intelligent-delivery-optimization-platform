import { prisma } from '../../plugins/prisma';
import { 
  DriverAvailability, 
  DriverWorkingStatus, 
  DriverVerificationStatus,
  DriverEventType
} from '@prisma/client';
import { 
  RegisterDriverInput, 
  UpdateProfileInput, 
  UpdateAvailabilityInput, 
  UpdateWorkingStatusInput, 
  UpdateLocationInput 
} from './driver.schema';
import { driverCache } from './driver.cache';

export class DriverService {
  async createDriver(userId: string, data: RegisterDriverInput) {
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) throw new Error('User not found');
    if (existingUser.role !== 'DRIVER') throw new Error('User is not a driver');

    const existingProfile = await prisma.driverProfile.findUnique({ where: { userId } });
    if (existingProfile) throw new Error('Driver profile already exists');

    return prisma.$transaction(async (tx) => {
      const profile = await tx.driverProfile.create({
        data: {
          userId,
          phoneNumber: data.phoneNumber,
          employeeCode: data.employeeCode,
          vehicleType: data.vehicleType,
          vehicleNumber: data.vehicleNumber,
          vehicleCapacity: data.vehicleCapacity,
        },
      });

      await tx.driverEvent.create({
        data: {
          driverId: profile.id,
          eventType: DriverEventType.REGISTERED,
          message: 'Driver profile created',
        },
      });

      return profile;
    });

    // TODO: Kafka DriverRegistered
  }

  async getDriverByUserId(userId: string) {
    const profile = await prisma.driverProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new Error('Driver profile not found');
    return profile;
  }

  async getDriverById(driverId: string) {
    const profile = await prisma.driverProfile.findUnique({
      where: { id: driverId },
    });
    if (!profile) throw new Error('Driver profile not found');
    return profile;
  }

  async updateDriver(userId: string, data: UpdateProfileInput) {
    const profile = await this.getDriverByUserId(userId);

    return prisma.driverProfile.update({
      where: { id: profile.id },
      data: { ...data },
    });
  }

  async updateAvailability(userId: string, data: UpdateAvailabilityInput) {
    const profile = await this.getDriverByUserId(userId);

    return prisma.$transaction(async (tx) => {
      const updated = await tx.driverProfile.update({
        where: { id: profile.id },
        data: { 
          availabilityStatus: data.status,
          availabilityReason: data.reason || null,
        },
      });

      await tx.driverEvent.create({
        data: {
          driverId: profile.id,
          eventType: DriverEventType.AVAILABILITY_CHANGED,
          message: `Availability changed to ${data.status}`,
          metadata: { reason: data.reason },
        },
      });

      return updated;
    });
  }

  async updateWorkingStatus(userId: string, data: UpdateWorkingStatusInput) {
    const profile = await this.getDriverByUserId(userId);

    return prisma.driverProfile.update({
      where: { id: profile.id },
      data: { workingStatus: data.status },
    });
  }

  async updateLocation(userId: string, data: UpdateLocationInput) {
    const profile = await this.getDriverByUserId(userId);

    if (!profile.locationSharingEnabled) {
      throw new Error('Location sharing is currently disabled');
    }

    const capturedAt = new Date();

    return prisma.$transaction(async (tx) => {
      // 1. Update latest coordinates on profile
      const updated = await tx.driverProfile.update({
        where: { id: profile.id },
        data: {
          currentLatitude: data.latitude,
          currentLongitude: data.longitude,
          lastLocationUpdate: capturedAt,
        },
      });

      // 2. Append immutable history
      await tx.driverLocationHistory.create({
        data: {
          driverId: profile.id,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          heading: data.heading,
          accuracy: data.accuracy,
          batteryLevel: data.batteryLevel,
          capturedAt,
        },
      });

      // TODO: Future GPS Optimization
      // - Redis location cache (driverCache.setCachedLocation)
      // - WebSocket broadcast
      // - Kafka DriverLocationUpdated
      // - ETA recalculation if on active delivery
      // - Geofencing checks

      return updated;
    });
  }

  async getCurrentLocation(driverId: string) {
    // Try cache first
    const cached = await driverCache.getCachedLocation(driverId);
    if (cached) return cached;

    const profile = await this.getDriverById(driverId);
    return {
      latitude: profile.currentLatitude,
      longitude: profile.currentLongitude,
      lastUpdate: profile.lastLocationUpdate,
    };
  }

  async getLocationHistory(driverId: string) {
    return prisma.driverLocationHistory.findMany({
      where: { driverId },
      orderBy: { capturedAt: 'desc' },
      take: 100, // Limit for now
    });
  }

  /**
   * Used by Assignment Engine to find eligible drivers.
   * Single source of truth for driver eligibility.
   */
  async getEligibleDrivers() {
    return prisma.driverProfile.findMany({
      where: {
        verificationStatus: DriverVerificationStatus.VERIFIED,
        isOnline: true,
        availabilityStatus: DriverAvailability.AVAILABLE,
        isDeleted: false,
      },
    }).then(drivers => drivers.filter(d => d.activeAssignments < d.maxCapacity));
  }

  async setOnline(userId: string) {
    const profile = await this.getDriverByUserId(userId);
    
    return prisma.$transaction(async (tx) => {
      const updated = await tx.driverProfile.update({
        where: { id: profile.id },
        data: { isOnline: true },
      });

      await tx.driverEvent.create({
        data: {
          driverId: profile.id,
          eventType: DriverEventType.ONLINE,
          message: 'Driver went online',
        },
      });

      return updated;
    });

    // TODO: Kafka DriverOnline
  }

  async setOffline(userId: string) {
    const profile = await this.getDriverByUserId(userId);
    
    return prisma.$transaction(async (tx) => {
      const updated = await tx.driverProfile.update({
        where: { id: profile.id },
        data: { isOnline: false },
      });

      await tx.driverEvent.create({
        data: {
          driverId: profile.id,
          eventType: DriverEventType.OFFLINE,
          message: 'Driver went offline',
        },
      });

      return updated;
    });

    // TODO: Kafka DriverOffline
  }

  async incrementCompletedDeliveries(driverId: string) {
    return prisma.driverProfile.update({
      where: { id: driverId },
      data: {
        completedDeliveries: { increment: 1 },
        activeAssignments: { decrement: 1 },
      },
    });
  }

  async incrementRejectedAssignments(driverId: string) {
    return prisma.driverProfile.update({
      where: { id: driverId },
      data: { rejectedAssignments: { increment: 1 } },
    });
  }
}

export const driverService = new DriverService();
