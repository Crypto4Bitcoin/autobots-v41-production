import { GlobalWorkloadScheduler } from './global-workload-scheduler';

export class RegionFailoverService {
  /**
   * Automatically reroutes workloads when a region becomes unavailable.
   */
  static async handleRegionalOutage(regionId: string) {
    console.warn(`[RegionFailover] REGIONAL OUTAGE DETECTED: ${regionId}`);
    
    // Mark region offline in scheduler
    GlobalWorkloadScheduler.setRegionHealth(regionId, 'Offline');
    
    console.log(`[RegionFailover] Active workloads for ${regionId} are being redirected to healthiest alternatives.`);
  }
}
