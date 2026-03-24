
import { GenomeService } from "./genome.service";

export class GenomePatternExtractor {
  static async process(incident: unknown) {
    console.log("[Extractor] Extracting pattern from incident:", incident.incident_id);
    const candidate = GenomeService.extractCandidate(incident);
    return { status: "success", candidate };
  }
}
