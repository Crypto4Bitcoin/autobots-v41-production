export interface GlobalCapability {
  capability_id: string;
  category: string;
  runtimes: string[];
  performance_score: number;
}

export class GlobalCapabilityIndexService {
  private static capabilities: Map<string, GlobalCapability> = new Map();

  static initialize() {
    this.capabilities.set("voice-hq", {
      capability_id: "voice-hq",
      category: "voice",
      runtimes: ["runtime-us-east-1"],
      performance_score: 98
    });

    this.capabilities.set("browser-ops", {
      capability_id: "browser-ops",
      category: "automation",
      runtimes: ["runtime-us-east-1", "runtime-eu-central-1"],
      performance_score: 85
    });

    this.capabilities.set("high-compliance-workflow", {
      capability_id: "high-compliance-workflow",
      category: "execution",
      runtimes: ["runtime-eu-central-1"],
      performance_score: 95
    });
  }

  static findRuntimes(capabilityId: string): string[] {
    return this.capabilities.get(capabilityId)?.runtimes || [];
  }

  static listCapabilities(): GlobalCapability[] {
    return Array.from(this.capabilities.values());
  }
}

GlobalCapabilityIndexService.initialize();
