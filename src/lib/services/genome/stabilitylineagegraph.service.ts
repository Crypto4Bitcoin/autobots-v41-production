
import { LineageService } from "./stability-lineage.service";

export class StabilityLineageGraph {
  static async process(payload: unknown) {
    if (payload.action === "record") {
      const node = LineageService.recordEvolution(payload.gene_id, payload.ancestor_id, payload.incident_id);
      return { status: "success", node };
    }
    return { status: "success", count: LineageService.getGraph().length };
  }
}
