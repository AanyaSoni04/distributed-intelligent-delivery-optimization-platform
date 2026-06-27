import { prisma } from '../../plugins/prisma';

export interface DriverCandidate {
  driverId: string;
  score: number;
}

/**
 * Abstracts driver retrieval away from the Assignment Engine.
 * The Driver module (when built) will provide a real implementation.
 */
export interface DriverProvider {
  getEligibleDrivers(deliveryId: string): Promise<DriverCandidate[]>;
}

/**
 * Temporary stub for DriverProvider until Driver module is built.
 */
export class DefaultDriverProvider implements DriverProvider {
  async getEligibleDrivers(deliveryId: string): Promise<DriverCandidate[]> {
    // TODO: When DriverProfile exists, query for available drivers.
    // For now, if we have any dummy drivers, just return them.
    
    // As a complete placeholder (since DriverProfile doesn't exist):
    return [];
  }
}

export interface AssignmentStrategy {
  readonly name: string;
  selectDriver(deliveryId: string, provider: DriverProvider): Promise<DriverCandidate | null>;
}

/**
 * Phase 1 Implementation: Selects the first eligible driver provided.
 */
export class FirstEligibleStrategy implements AssignmentStrategy {
  readonly name = 'FirstEligible';

  async selectDriver(deliveryId: string, provider: DriverProvider): Promise<DriverCandidate | null> {
    const candidates = await provider.getEligibleDrivers(deliveryId);
    if (candidates.length > 0) {
      return candidates[0];
    }
    return null;
  }
}

// TODO: Future Strategies
// export class NearestDriverStrategy implements AssignmentStrategy { ... }
// export class LeastLoadedStrategy implements AssignmentStrategy { ... }
// export class PriorityStrategy implements AssignmentStrategy { ... }
// export class AIAssignmentStrategy implements AssignmentStrategy { ... }
