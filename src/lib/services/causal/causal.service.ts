
import fs from "fs";
import path from "path";

export interface CausalNode {
  id: string;
  timestamp: string;
  event: string;
  source_layer: string;
  severity: "info" | "warning" | "error" | "critical";
  parents: string[]; // Parent event IDs (causes)
  metadata: unknown;
}

export class CausalGraphService {
  private static CAUSAL_FILE = path.join(process.cwd(), "src/lib/constants/causal-graph.json");

  static logEvent(event: Omit<CausalNode, "id" | "timestamp">): CausalNode {
    const graph = this.getGraph();
    const newNode: CausalNode = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    graph.push(newNode);
    this.saveGraph(graph);
    console.log("[CausalGraph] Event logged:", newNode.id);
    return newNode;
  }

  static getGraph(): CausalNode[] {
    if (!fs.existsSync(this.CAUSAL_FILE)) {
      const dir = path.dirname(this.CAUSAL_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(this.CAUSAL_FILE, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(this.CAUSAL_FILE, "utf8"));
  }

  private static saveGraph(graph: CausalNode[]) {
    fs.writeFileSync(this.CAUSAL_FILE, JSON.stringify(graph, null, 2));
  }

  static reconstructChain(eventId: string): CausalNode[] {
    const graph = this.getGraph();
    const chain: CausalNode[] = [];
    const currentId = eventId;
    
    const visit = (id: string) => {
      const node = graph.find(n => n.id === id);
      if (node) {
        chain.push(node);
        node.parents.forEach(p => visit(p));
      }
    };
    
    visit(currentId);
    return chain;
  }
}

export class SystemNarrativeGenerator {
  static generate(chain: CausalNode[]): string {
    if (chain.length === 0) return "No causal context available.";
    
    return chain.map((node, i) => {
      const prefix = i === 0 ? "Problem detected: " : "Triggered by: ";
      return `[${node.source_layer}] ${prefix}${node.event} (Severity: ${node.severity})`;
    }).join(" \n ");
  }
}
