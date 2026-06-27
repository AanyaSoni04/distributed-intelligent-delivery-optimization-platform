import { DeliveryStatus } from '@prisma/client';

/**
 * Strict state machine for delivery status transitions.
 * Terminal statuses (DELIVERED, CANCELLED, RETURNED) have no outgoing transitions.
 */
export const VALID_STATUS_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  CREATED:          [DeliveryStatus.PICKUP_PENDING, DeliveryStatus.CANCELLED],
  PICKUP_PENDING:   [DeliveryStatus.PICKED_UP, DeliveryStatus.CANCELLED],
  PICKED_UP:        [DeliveryStatus.IN_TRANSIT],
  IN_TRANSIT:       [DeliveryStatus.OUT_FOR_DELIVERY],
  OUT_FOR_DELIVERY: [DeliveryStatus.DELIVERED, DeliveryStatus.FAILED],
  FAILED:           [DeliveryStatus.PICKUP_PENDING, DeliveryStatus.RETURNED],
  DELIVERED:        [],
  CANCELLED:        [],
  RETURNED:         [],
};

export const TERMINAL_STATUSES: DeliveryStatus[] = [
  DeliveryStatus.DELIVERED,
  DeliveryStatus.CANCELLED,
  DeliveryStatus.RETURNED,
];

export function isValidTransition(from: DeliveryStatus, to: DeliveryStatus): boolean {
  return VALID_STATUS_TRANSITIONS[from].includes(to);
}

export function isTerminalStatus(status: DeliveryStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}
