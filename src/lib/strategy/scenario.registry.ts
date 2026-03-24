import type { Scenario } from './scenario-planning.service';
import type { SimulationResult } from './simulation.engine';

export interface ScenarioRecord {
  scenario: Scenario;
  result: SimulationResult;
  timestamp: number;
  selected: boolean;
}

export class ScenarioRegistry {
  private static records: Map<string, ScenarioRecord[]> = new Map();

  static async saveRecord(workspaceId: string, record: ScenarioRecord) {
    const wsRecords = this.records.get(workspaceId) || [];
    wsRecords.push(record);
    this.records.set(workspaceId, wsRecords);
    console.log(`[ScenarioRegistry] Saved simulation for ${record.scenario.name} in workspace ${workspaceId}`);
  }

  static getRecords(workspaceId: string): ScenarioRecord[] {
    return this.records.get(workspaceId) || [];
  }
}
