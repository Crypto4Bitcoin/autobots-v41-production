import { MaintenanceRegistryService } from "./maintenance-registry.service";

export class GlobalRecoveryCoordinator {
  static async triggerFailover(failedRegion: string) {
    console.log(`[GlobalRecovery] !!! REGIONAL FAILURE DETECTED: ${failedRegion} !!!`);
    
    const runtimes = MaintenanceRegistryService.listRuntimes();
    const healthy = runtimes.filter(r => r.region !== failedRegion && r.status === "online");
    
    if (healthy.length > 0) {
      const target = healthy[0];
      console.log(`[GlobalRecovery] Rerouting traffic from ${failedRegion} to ${target.region} (${target.endpoint})`);
      return { success: true, target_region: target.region };
    }
    
    console.error("[GlobalRecovery] CRITICAL: No healthy regions available for failover!");
    return { success: false };
  }
}