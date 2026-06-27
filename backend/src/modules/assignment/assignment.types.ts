import { AssignmentStatus } from '@prisma/client';

/**
 * Strict state machine for assignment status transitions.
 * Terminal statuses (DRIVER_ACCEPTED, DRIVER_REJECTED, REASSIGNMENT_REQUIRED) have no outgoing transitions.
 * Note: When an assignment is rejected/reassigned, a NEW Assignment record is created.
 */
export const VALID_ASSIGNMENT_TRANSITIONS: Record<AssignmentStatus, AssignmentStatus[]> = {
  UNASSIGNED:            [AssignmentStatus.ASSIGNMENT_PENDING],
  ASSIGNMENT_PENDING:    [AssignmentStatus.ASSIGNED],
  ASSIGNED:              [
                           AssignmentStatus.DRIVER_ACCEPTED,
                           AssignmentStatus.DRIVER_REJECTED,
                           AssignmentStatus.REASSIGNMENT_REQUIRED
                         ],
  DRIVER_ACCEPTED:       [], // Terminal for this assignment
  DRIVER_REJECTED:       [], // Terminal
  REASSIGNMENT_REQUIRED: [], // Terminal
};

export const TERMINAL_ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  AssignmentStatus.DRIVER_ACCEPTED,
  AssignmentStatus.DRIVER_REJECTED,
  AssignmentStatus.REASSIGNMENT_REQUIRED,
];

export const ACTIVE_ASSIGNMENT_STATUSES: AssignmentStatus[] = [
  AssignmentStatus.ASSIGNMENT_PENDING,
  AssignmentStatus.ASSIGNED,
  AssignmentStatus.DRIVER_ACCEPTED,
];

export function isValidAssignmentTransition(from: AssignmentStatus, to: AssignmentStatus): boolean {
  return VALID_ASSIGNMENT_TRANSITIONS[from].includes(to);
}

export function isTerminalAssignmentStatus(status: AssignmentStatus): boolean {
  return TERMINAL_ASSIGNMENT_STATUSES.includes(status);
}

export function isActiveAssignmentStatus(status: AssignmentStatus): boolean {
  return ACTIVE_ASSIGNMENT_STATUSES.includes(status);
}
