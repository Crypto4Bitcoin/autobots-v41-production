import { GlobalRuntimeRegistryService } from "./global-runtime-registry.service";

export class GlobalRecoveryService {
  static async initiateFailover(affectedRuntimeId: string): Promise<{ success: boolean; target_runtime?: string }> {
    console.warn(`[GlobalRecovery] Initiating failover for degraded runtime: ${affectedRuntimeId}`);
    
    // 1. Identify unhealthy runtime
    GlobalRuntimeRegistryService.updateHealth(affectedRuntimeId, 'failed');

    // 2. Find healthiest peer in same org or trusted org
    const healthyPeers = GlobalRuntimeRegistryService.listRuntimes().filter(r => 
      r.runtime_id !== affectedRuntimeId && r.health_status === 'healthy'
    );

    if (healthyPeers.length === 0) {
      console.error("[GlobalRecovery] No healthy peer runtimes available for failover!");
      return { success: false };
    }

    const target = healthyPeers[0].runtime_id;
    console.log(`[GlobalRecovery] Failover target selected: ${target}`);
    
    return { success: true, target_runtime: target };
  }
}
