export interface GlobalRuntime {
  runtime_id: string;
  region: string;
  environment: 'dev' | 'staging' | 'prod';
  org_id: string;
  runtime_version: string;
  health_status: 'healthy' | 'degraded' | 'failed' | 'quarantined';
  capacity_status: 'available' | 'constrained' | 'full';
  supported_capabilities: string[];
  policy_scope: string;
  federation_status: 'none' | 'limited' | 'trusted' | 'strategic';
  last_heartbeat: string;
}

export class GlobalRuntimeRegistryService {
  private static runtimes: Map<string, GlobalRuntime> = new Map();

  static register(runtime: GlobalRuntime) {
    console.log(`[GlobalRegistry] Registering runtime: ${runtime.runtime_id} (${runtime.region})`);
    this.runtimes.set(runtime.runtime_id, {
      ...runtime,
      last_heartbeat: new Date().toISOString()
    });
  }

  static getRuntime(id: string): GlobalRuntime | undefined {
    return this.runtimes.get(id);
  }

  static listRuntimes(): GlobalRuntime[] {
    return Array.from(this.runtimes.values());
  }

  static findByCapability(capability: string): GlobalRuntime[] {
    return this.listRuntimes().filter(r => 
      r.supported_capabilities.includes(capability) && 
      r.health_status === 'healthy'
    );
  }

  static updateHealth(id: string, status: GlobalRuntime['health_status']) {
    const runtime = this.getRuntime(id);
    if (runtime) {
      runtime.health_status = status;
      runtime.last_heartbeat = new Date().toISOString();
    }
  }
}

// Seed with baseline runtimes
GlobalRuntimeRegistryService.register({
  runtime_id: "runtime-us-east-1",
  region: "us-east",
  environment: "prod",
  org_id: "autobots-main",
  runtime_version: "v1.3.5",
  health_status: "healthy",
  capacity_status: "available",
  supported_capabilities: ["voice", "workflow", "self_healing", "browser"],
  policy_scope: "global",
  federation_status: "trusted",
  last_heartbeat: new Date().toISOString()
});

GlobalRuntimeRegistryService.register({
  runtime_id: "runtime-eu-central-1",
  region: "eu-central",
  environment: "prod",
  org_id: "autobots-main",
  runtime_version: "v1.3.5",
  health_status: "healthy",
  capacity_status: "available",
  supported_capabilities: ["workflow", "memory_sync", "gdpr_compliance"],
  policy_scope: "eu_only",
  federation_status: "trusted",
  last_heartbeat: new Date().toISOString()
});
