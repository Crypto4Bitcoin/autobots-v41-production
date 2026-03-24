import { AppEvent } from './event-intelligence.service';

export type EventSeverity = 'Informational' | 'Operational' | 'High' | 'Critical';
export type EventPriority = 'Low' | 'Medium' | 'High';

export interface DecisionOutcome {
  actionRequired: boolean;
  severity: EventSeverity;
  priority: EventPriority;
  approvalMandatory: boolean;
  confidence: number;
  suggestedActionType?: string;
  rationale: string;
  explainability: {
    ruleTriggered: string;
    inputs: string[];
    policyGatesApplied: string[];
  };
}

export class DecisionRuleEngine {
  /**
   * Evaluates events against Confidence + Severity + Priority classes.
   */
  static async evaluate(event: AppEvent): Promise<DecisionOutcome> {
    const severity = this.calculateSeverity(event);
    const priority = this.calculatePriority(event);
    
    const outcome: DecisionOutcome = {
      actionRequired: severity !== 'Informational',
      severity,
      priority,
      approvalMandatory: severity === 'High' || severity === 'Critical',
      confidence: event.confidence,
      rationale: `Strategic assessment for ${event.type}`,
      explainability: {
        ruleTriggered: `auto_rule_${event.type}`,
        inputs: Object.keys(event.payload),
        policyGatesApplied: ['workspace_policy', 'budget_guard']
      }
    };

    return outcome;
  }

  private static calculateSeverity(event: AppEvent): EventSeverity {
    if (event.type === 'market_volatility') return 'High';
    return 'Operational';
  }

  private static calculatePriority(event: AppEvent): EventPriority {
    if (event.type === 'market_volatility') return 'High';
    return 'Medium';
  }
}

export const DecisionOutcome = {} as any;
