
import { GenomeService } from "./genome.service";

export class GenomeScoringEngine {
  static async process(gene: unknown) {
    console.log("[Scoring] Rescoring gene:", gene.gene_id);
    const score = GenomeService.scorePattern(gene);
    return { status: "success", score };
  }
}
