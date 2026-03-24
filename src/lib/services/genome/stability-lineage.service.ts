import fs from "fs";
import path from "path";

export interface LineageNode {
  node_id: string;
  gene_id: string;
  ancestor_gene_ids: string[];
  emerged_from_incident: string;
  evolution_stage: number;
  timestamp: string;
}

export class LineageService {
  private static LINEAGE_FILE = path.join(process.cwd(), "src/lib/constants/lineage-db.json");

  static getGraph(): LineageNode[] {
    if (!fs.existsSync(this.LINEAGE_FILE)) {
      const initial: LineageNode[] = [{
        node_id: "node-001",
        gene_id: "gene-001",
        ancestor_gene_ids: [],
        emerged_from_incident: "platform_genesis",
        evolution_stage: 1,
        timestamp: new Date().toISOString()
      }];
      this.saveGraph(initial);
      return initial;
    }
    return JSON.parse(fs.readFileSync(this.LINEAGE_FILE, "utf8"));
  }

  static saveGraph(graph: LineageNode[]) {
    const dir = path.dirname(this.LINEAGE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(this.LINEAGE_FILE, JSON.stringify(graph, null, 2));
  }

  static recordEvolution(gene_id: string, ancestor_id: string, incident_id: string) {
    const graph = this.getGraph();
    const ancestor = graph.find(n => n.gene_id === ancestor_id);
    const newNode: LineageNode = {
      node_id: "node-" + Date.now(),
      gene_id,
      ancestor_gene_ids: ancestor ? [ancestor_id] : [],
      emerged_from_incident: incident_id,
      evolution_stage: ancestor ? ancestor.evolution_stage + 1 : 1,
      timestamp: new Date().toISOString()
    };
    graph.push(newNode);
    this.saveGraph(graph);
    return newNode;
  }
}
