export type Region = "us-east" | "us-west" | "eu-central" | "ap-southeast";

export interface ExecutionTrace {
  runId: string;
  region: Region;
  timestamp: string;
  action: string;
  stateSnapshot: unknown;
}

export class RegionRegistry {
  static getAvailableRegions(): Region[] {
    return ["us-east", "us-west", "eu-central", "ap-southeast"];
  }
}

export class RegionHealthMonitor {
  private static regionStatus: Record<Region, boolean> = {
    "us-east": true,
    "us-west": true,
    "eu-central": true,
    "ap-southeast": true
  };

  static setHealth(region: Region, isHealthy: boolean) {
    this.regionStatus[region] = isHealthy;
  }

  static isHealthy(region: Region): boolean {
    return this.regionStatus[region];
  }

  static getNearestHealthy(tenantRegion?: Region): Region {
    const defaultOrder: Region[] = ["us-east", "us-west", "eu-central", "ap-southeast"];
    if (tenantRegion && this.isHealthy(tenantRegion)) return tenantRegion;
    for (const r of defaultOrder) {
      if (this.isHealthy(r)) return r;
    }
    throw new Error("Planetary Outage: No healthy regions available.");
  }
}

export class EdgeWorkerService {
  static selectWorker(region: Region, workloadType: string): string {
    return `worker-${region}-${workloadType}-${Math.floor(Math.random() * 100)}`;
  }
}

export class RegionRoutingService {
  static routeWorkflow(workspaceId: string, workflowId: string, affinity?: Region): Region {
    const targetRegion = affinity && RegionHealthMonitor.isHealthy(affinity) 
        ? affinity 
        : RegionHealthMonitor.getNearestHealthy(affinity);
        
    console.log(`[RegionRouting] Routed ${workflowId} to region: ${targetRegion} (Affinity: ${affinity || "None"})`);
    return targetRegion;
  }
}

export class MultiRegionStateService {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static replicaStores: Record<Region, Map<string, any>> = {
    "us-east": new Map(),
    "us-west": new Map(),
    "eu-central": new Map(),
    "ap-southeast": new Map()
  };

  static replicateState(primaryRegion: Region, stateKey: string, stateData: unknown) {
    for (const r of RegionRegistry.getAvailableRegions()) {
       this.replicaStores[r].set(stateKey, stateData);
    }
    console.log(`[MultiRegionState] Replicated state ${stateKey} globally from primary ${primaryRegion}`);
  }

  static getState(region: Region, stateKey: string): unknown {
    return this.replicaStores[region].get(stateKey);
  }
}

export class TraceContinuityService {
  private static traceLog: ExecutionTrace[] = [];

  static record(runId: string, region: Region, action: string, stateSnapshot: unknown) {
     this.traceLog.push({ runId, region, timestamp: new Date().toISOString(), action, stateSnapshot });
     console.log(`[TraceRegion:${region}] [${runId}] ${action}`);
  }

  static getTraceStream(runId: string): ExecutionTrace[] {
     return this.traceLog.filter(t => t.runId === runId);
  }
}

export class CrossRegionFailoverService {
  private static activeFailovers: Set<string> = new Set();
  
  static async executeWithFailover(
     runId: string, 
     workspaceId: string, 
     workflowId: string, 
     affinity: Region,
     executePayload: (region: Region) => Promise<unknown>
  ) {
     const currentRegion = RegionRoutingService.routeWorkflow(workspaceId, workflowId, affinity);
     
     try {
        TraceContinuityService.record(runId, currentRegion, "Execution Started", { step: 1 });
        const result = await executePayload(currentRegion);
        TraceContinuityService.record(runId, currentRegion, "Execution Completed", { step: 2 });
        MultiRegionStateService.replicateState(currentRegion, runId, { status: "completed", data: result });
        return result;
     } catch (e: unknown) {
        if (e.message === "REGION_FAILURE") {
           console.warn(`[FailoverService] Primary region ${currentRegion} failed. Initiating global failover...`);
           
           if (this.activeFailovers.has(runId)) {
               throw new Error("Duplicate Execution Prevented: A failover recovery is already in progress for this run.");
           }
           this.activeFailovers.add(runId);
           
           RegionHealthMonitor.setHealth(currentRegion, false); // Mark dead
           
           const secondaryRegion = RegionHealthMonitor.getNearestHealthy();
           console.log(`[FailoverService] Handed off execution for ${runId} to secondary region ${secondaryRegion}`);
           
           TraceContinuityService.record(runId, secondaryRegion, "Failover Resumed", { step: 1 });
           
// eslint-disable-next-line @typescript-eslint/no-unused-vars
           const replicaState = MultiRegionStateService.getState(secondaryRegion, runId) || { step: 1 };
           
           try {
              const retryResult = await executePayload(secondaryRegion);
              TraceContinuityService.record(runId, secondaryRegion, "Failover Completed", { step: 2, recovered: true });
              MultiRegionStateService.replicateState(secondaryRegion, runId, { status: "completed", data: retryResult });
              this.activeFailovers.delete(runId);
              return retryResult;
           } catch (err: unknown) {
              this.activeFailovers.delete(runId);
              throw err;
           }
        } else {
           throw e;
        }
     }
  }
}
