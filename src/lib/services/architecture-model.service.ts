export interface SystemComponent {
  id: string;
  type: "service" | "agent" | "endpoint" | "database";
  dependencies: string[];
  performance_score: number;
  last_upgrade?: string;
}

export class ArchitectureModel {
  private static graph: Map<string, SystemComponent> = new Map();

  static initialize() {
    this.graph.set("unified_loop", { id: "unified_loop", type: "service", dependencies: ["taxonomy", "sandbox"], performance_score: 0.95 });
    this.graph.set("global_coordinator", { id: "global_coordinator", type: "service", dependencies: ["registry"], performance_score: 0.92 });
    this.graph.set("intelligence_core", { id: "intelligence_core", type: "service", dependencies: ["memory"], performance_score: 0.88 });
  }

  static getComponent(id: string) { return this.graph.get(id); }
  static listComponents() { return Array.from(this.graph.values()); }
  static updateComponent(comp: SystemComponent) { this.graph.set(comp.id, comp); }
}

ArchitectureModel.initialize();