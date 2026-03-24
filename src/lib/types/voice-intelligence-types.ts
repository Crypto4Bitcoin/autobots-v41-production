export enum VoiceActionClass {
  INFORMATIONAL = "informational", // Safe, read-only
  PREPARATORY = "preparatory",     // Drafts, plans, simulations
  OPERATIONAL = "operational",     // Internal state changes (retry, approve)
  SIDE_EFFECTFUL = "side_effectful"// External actions (publish, post)
}

export enum VoiceGovernanceOutcome {
  ALLOW = "allow",
  CONFIRM = "confirm",
  SIMULATE = "simulate",
  DENY = "deny",
  ESCALATE = "escalate",
  HOLD = "hold",
  PROPOSAL = "proposal"
}

export interface VoiceIntent {
  intentName: string;
  actionClass: VoiceActionClass;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  entities: Record<string, any>;
  confidence: number;
  initialRiskScore: number;
  unresolvedReferences?: string[];
  isSimulationRequested: boolean;
  rawUtterance: string;
}

export interface ExecutionPlanUnit {
  type: "query" | "action" | "workflow_trigger" | "macro" | "workflow_assembly";
  target: string;
  payload: unknown;
  dependsOn?: string;
}

export interface VoiceExecutionPlan {
  units: ExecutionPlanUnit[];
  explanation: string;
  reasonCode?: string;
}

export const VoiceIntent = {} as any;

export const VoiceExecutionPlan = {} as any;

export const VoiceActionClass = {} as any;

export const VoiceGovernanceOutcome = {} as any;
