import { GlobalRuntimeRegistryService } from "./global-runtime-registry.service";

export class GlobalHealthService {
  static getGlobalHealthSummary() {
    const runtimes = GlobalRuntimeRegistryService.listRuntimes();
    const healthyCount = runtimes.filter(r => r.health_status === 'healthy').length;
    
    return {
      total_runtimes: runtimes.length,
      healthy_runtimes: healthyCount,
      system_stability: (healthyCount / runtimes.length) * 100,
      active_incidents: 0 // In sync with Stage 1
    };
  }
}
