export interface ExecutionRegion {
  id: string;
  name: string;
  health: 'Healthy' | 'Degraded' | 'Offline';
  latency: number;
}

export class GlobalWorkloadScheduler {
  private static regions: ExecutionRegion[] = [
    { id: 'us-east', name: 'US East (N. Virginia)', health: 'Healthy', latency: 45 },
    { id: 'us-west', name: 'US West (Oregon)', health: 'Healthy', latency: 20 },
    { id: 'eu-central', name: 'Europe (Frankfurt)', health: 'Healthy', latency: 120 },
    { id: 'ap-south', name: 'Asia Pacific (Mumbai)', health: 'Healthy', latency: 250 }
  ];

  /**
   * Routes tasks to the nearest available worker cluster based on latency and health.
   */
  static routeWorkload(workspaceId: string, taskType: string): ExecutionRegion {
    console.log(`[GlobalScheduler] Routing workload for workspace ${workspaceId} [Task: ${taskType}]`);
    
    // Sort by health and then latency
    const available = this.regions.filter(r => r.health !== 'Offline').sort((a, b) => a.latency - b.latency);
    
    const selected = available[0] || this.regions[0];
    console.log(`[GlobalScheduler] Selected region ${selected.id} for execution.`);
    return selected;
  }

  static setRegionHealth(regionId: string, health: 'Healthy' | 'Degraded' | 'Offline') {
    const region = this.regions.find(r => r.id === regionId);
    if (region) region.health = health;
  }
}
