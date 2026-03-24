export interface DependencyLink { service_a: string; service_b: string; strength: number; type: "hidden" | "explicit"; }

export class DependencyMapperService {
  private static map: DependencyLink[] = [
    { service_a: "routing_engine", service_b: "fabric_gateway", strength: 0.9, type: "explicit" },
    { service_a: "memory_sync", service_b: "auth_validation", strength: 0.4, type: "hidden" }
  ];

  static findImpact(serviceId: string) {
    return this.map.filter(l => l.service_a === serviceId || l.service_b === serviceId);
  }

  static async analyzeMutationImpact(mutation: unknown) {
    const impacts = this.findImpact(mutation.target_id);
    if (impacts.some(i => i.type === "hidden")) {
      return { safe: false, reason: "HIDDEN_DEPENDENCY_DETECTED", links: impacts.filter(i => i.type === "hidden") };
    }
    return { safe: true };
  }
}