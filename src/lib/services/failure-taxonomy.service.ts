export type FailureCategory = 
  | "frontend_error" 
  | "api_error" 
  | "workflow_error" 
  | "queue_error" 
  | "agent_error" 
  | "memory_error" 
  | "infra_error" 
  | "policy_error";

export interface FailureTaxonomy {
  category: FailureCategory;
  severity: "low" | "medium" | "high" | "critical";
  repair_class: "auto" | "approval_required" | "manual_only";
  replay_strategy: "none" | "immediate" | "exponential_backoff" | "manual";
  rollback_strategy: "none" | "atomic" | "cascading";
}

export class FailureTaxonomyEngine {
  private static taxonomyMap: Record<string, FailureTaxonomy> = {
    "404": {
      category: "api_error",
      severity: "medium",
      repair_class: "auto",
      replay_strategy: "none",
      rollback_strategy: "atomic"
    },
    "500": {
      category: "api_error",
      severity: "high",
      repair_class: "approval_required",
      replay_strategy: "exponential_backoff",
      rollback_strategy: "atomic"
    },
    "workflow_stalled": {
      category: "workflow_error",
      severity: "high",
      repair_class: "approval_required",
      replay_strategy: "immediate",
      rollback_strategy: "atomic"
    },
    "agent_crash": {
      category: "agent_error",
      severity: "critical",
      repair_class: "manual_only",
      replay_strategy: "manual",
      rollback_strategy: "none"
    }
  };

  static classify(errorKey: string): FailureTaxonomy {
    return this.taxonomyMap[errorKey] || {
      category: "infra_error",
      severity: "medium",
      repair_class: "manual_only",
      replay_strategy: "none",
      rollback_strategy: "none"
    };
  }
}
