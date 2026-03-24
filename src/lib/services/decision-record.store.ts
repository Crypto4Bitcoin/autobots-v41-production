import { DecisionOutcome } from './decision-rule-engine';

export interface DecisionRecord {
  id: string;
  eventId: string;
  timestamp: string;
  outcome: DecisionOutcome;
  confidence: number;
  planId?: string;
  status: 'proposed' | 'approved' | 'rejected' | 'executed';
  // [NEW] Explainability Fields
  explainability: {
    signals: string[];
    ruleId: string;
    confidenceScore: number;
    severityScore: string;
    priorityUrgency: string;
    policyGatesApplied: string[];
    approvalRequired: boolean;
  };
}

export class DecisionRecordStore {
  private static records: Map<string, DecisionRecord> = new Map();

  static async record(eventId: string, outcome: DecisionOutcome): Promise<string> {
    const id = `dec_${Date.now()}`;
    const record: DecisionRecord = {
      id,
      eventId,
      timestamp: new Date().toISOString(),
      outcome,
      confidence: outcome.confidence,
      status: 'proposed',
      explainability: {
        signals: outcome.explainability.inputs,
        ruleId: outcome.explainability.ruleTriggered,
        confidenceScore: outcome.confidence,
        severityScore: outcome.severity,
        priorityUrgency: outcome.priority,
        policyGatesApplied: outcome.explainability.policyGatesApplied,
        approvalRequired: outcome.approvalMandatory
      }
    };
    this.records.set(id, record);
    console.log(`[DecisionStore] Recorded decision ${id} with full explainability audit.`);
    return id;
  }

  static getRecord(id: string): DecisionRecord | undefined {
    return this.records.get(id);
  }
}
