import { z } from 'zod';
import { PackageType, PriorityLevel, ServiceLevel, DeliverySource, DeliveryStatus } from '@prisma/client';

export const createDeliverySchema = z.object({
  pickupAddressId: z.string().uuid('Invalid pickup address ID'),
  deliveryAddressId: z.string().uuid('Invalid delivery address ID'),
  packageWeight: z.number().positive('Package weight must be positive'),
  packageLength: z.number().positive('Package length must be positive').optional(),
  packageWidth: z.number().positive('Package width must be positive').optional(),
  packageHeight: z.number().positive('Package height must be positive').optional(),
  packageType: z.nativeEnum(PackageType),
  packageValue: z.number().min(0, 'Package value cannot be negative'),
  packageDescription: z.string().min(1, 'Package description is required'),
  priorityLevel: z.nativeEnum(PriorityLevel),
  serviceLevel: z.nativeEnum(ServiceLevel),
  source: z.nativeEnum(DeliverySource).default('CUSTOMER'),
  scheduledPickupTime: z.string().datetime().optional(),
  specialInstructions: z.string().optional(),
  clientRequestId: z.string().optional(),
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

export const updateDeliverySchema = z.object({
  packageWeight: z.number().positive().optional(),
  packageLength: z.number().positive().optional(),
  packageWidth: z.number().positive().optional(),
  packageHeight: z.number().positive().optional(),
  packageType: z.nativeEnum(PackageType).optional(),
  packageValue: z.number().min(0).optional(),
  packageDescription: z.string().min(1).optional(),
  priorityLevel: z.nativeEnum(PriorityLevel).optional(),
  serviceLevel: z.nativeEnum(ServiceLevel).optional(),
  specialInstructions: z.string().optional(),
  scheduledPickupTime: z.string().datetime().optional(),
  status: z.nativeEnum(DeliveryStatus).optional(),
});

export type UpdateDeliveryInput = z.infer<typeof updateDeliverySchema>;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});
