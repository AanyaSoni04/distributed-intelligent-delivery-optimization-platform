import { DriverProvider, DriverCandidate } from '../assignment/assignment.strategy';
import { driverService } from './driver.service';

/**
 * Concrete implementation of Assignment Engine's DriverProvider interface.
 * Connects the Driver Module to the Assignment Engine.
 */
export class DriverModuleProvider implements DriverProvider {
  async getEligibleDrivers(deliveryId: string): Promise<DriverCandidate[]> {
    const eligibleDrivers = await driverService.getEligibleDrivers();
    
    // Future TODO: Apply distance, ETA, Traffic, AI score calculations here
    // For now, we return all eligible drivers with a default score of 100.
    
    return eligibleDrivers.map(driver => ({
      driverId: driver.id,
      score: 100
    }));
  }
}
