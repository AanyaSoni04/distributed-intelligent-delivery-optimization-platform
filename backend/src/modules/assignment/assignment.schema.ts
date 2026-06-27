import { z } from 'zod';

export const assignDeliverySchema = z.object({
  deliveryId: z.string().uuid('Invalid delivery ID'),
  driverId: z.string().uuid('Invalid driver ID').optional(),
});

export type AssignDeliveryInput = z.infer<typeof assignDeliverySchema>;

export const acceptAssignmentSchema = z.object({
  assignmentId: z.string().uuid('Invalid assignment ID'),
});

export type AcceptAssignmentInput = z.infer<typeof acceptAssignmentSchema>;

export const rejectAssignmentSchema = z.object({
  assignmentId: z.string().uuid('Invalid assignment ID'),
  reason: z.string().optional(),
});

export type RejectAssignmentInput = z.infer<typeof rejectAssignmentSchema>;

export const reassignDeliverySchema = z.object({
  deliveryId: z.string().uuid('Invalid delivery ID'),
  driverId: z.string().uuid('Invalid driver ID').optional(),
});

export type ReassignDeliveryInput = z.infer<typeof reassignDeliverySchema>;
