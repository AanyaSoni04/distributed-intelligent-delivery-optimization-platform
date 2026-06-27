import { z } from 'zod';
import { DriverAvailability, DriverWorkingStatus } from '@prisma/client';

export const registerDriverSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  employeeCode: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
  vehicleCapacity: z.number().positive().optional(),
});
export type RegisterDriverInput = z.infer<typeof registerDriverSchema>;

export const updateProfileSchema = z.object({
  emergencyContact: z.string().optional(),
  licenseNumber: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleNumber: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleColor: z.string().optional(),
  deviceId: z.string().optional(),
  devicePlatform: z.string().optional(),
  appVersion: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateAvailabilitySchema = z.object({
  status: z.nativeEnum(DriverAvailability),
  reason: z.string().optional(),
});
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;

export const updateWorkingStatusSchema = z.object({
  status: z.nativeEnum(DriverWorkingStatus),
});
export type UpdateWorkingStatusInput = z.infer<typeof updateWorkingStatusSchema>;

export const updateLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  speed: z.number().min(0).optional(),
  heading: z.number().min(0).max(360).optional(),
  accuracy: z.number().min(0).optional(),
  batteryLevel: z.number().min(0).max(100).optional(),
});
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
