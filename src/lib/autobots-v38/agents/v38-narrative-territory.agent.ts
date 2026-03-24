
import { narrativeTerritoryService } from '../services/narrative-territory.service';

export class V38NarrativeTerritoryAgent {
  async createTerritory(input: Parameters<typeof narrativeTerritoryService.createTerritory>[0]) {
    return narrativeTerritoryService.createTerritory(input);
  }

  async recordInfluence(input: Parameters<typeof narrativeTerritoryService.recordInfluence>[0]) {
    return narrativeTerritoryService.recordInfluence(input);
  }

  async conflict(a: string, b: string, reason: string) {
    return narrativeTerritoryService.createConflict(a, b, reason);
  }

  async metrics() {
    return narrativeTerritoryService.metrics();
  }
}

export const v38NarrativeTerritoryAgent = new V38NarrativeTerritoryAgent();
