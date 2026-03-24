import { PipelineState } from "./enums";

export interface Artifact {
  id: string;
  workspaceId: string;
  pipelineItemId: string;
  agentRunId?: string;
  parentArtifactId?: string;
  type: string;
  data: unknown;
  createdAt: string;
}

export interface ArtifactFeedback {
  artifactId: string;
  score: number;
  metrics: Record<string, number>;
  providedBy: 'agent' | 'user' | 'evaluator';
  comments?: string;
}

export interface Agent {
  name: string;
  description: string;
  pack?: string; // e.g., 'media', 'research', 'core'
  process(input: AgentInput): Promise<AgentOutput>;
}

export interface WorkspacePolicyConfig {
  providerStrategyDefault: "cheap_first" | "balanced" | "quality_first";
  complianceModeDefault: "standard" | "strict";
  mandatoryReviewPlatforms: string[];
  sensitiveKeywordRules: {
    forceReview: boolean;
    keywords: string[];
  };
  queueLoadRules: {
    skipOptionalStagesAboveDepth: number | null;
    optionalStages: PipelineState[];
  };
}

export interface AgentExecutionContext {
  policyFlags: string[];
  providerStrategy: "cheap_first" | "balanced" | "quality_first";
  requiresHumanReview: boolean;
  skipOptionalStages: boolean;
  complianceMode: "standard" | "strict";
  riskLevel: "low" | "medium" | "high";
  reasonCodes: string[];
}

export interface AgentInput {
  pipelineItemId: string;
  workspaceId: string;
  workflowRunId?: string;
  nodeRunId?: string;
  inputState: PipelineState;
  targetState: PipelineState;
  payload: unknown;
  context?: AgentExecutionContext;
  parentArtifactId?: string;
  inputArtifacts?: Artifact[];
  metadata?: Record<string, unknown>;
}

export interface AgentOutput {
  status: "success" | "failed" | "retry" | "skipped";
  nextState?: PipelineState;
  output: unknown;
  artifact?: Partial<Artifact>; // Meta for new artifact creation
  outputArtifacts?: Partial<Artifact>[];
  feedback?: {
    score?: number;
    metrics?: Record<string, number>;
    providedBy?: string;
    comments?: string;
  }; // Self-scoring or auto-feedback
  metadata?: unknown;
}

export interface ProviderResult {
  success: boolean;
  text: string;
  tokens_used: number;
  provider: string;
  model: string;
  latency_ms: number;
  raw_metadata: unknown;
  error?: string;
}

export type JobResult = 
  | { outcome: "completed"; reason?: string }
  | { outcome: "retry"; reason: string }
  | { outcome: "failed"; reason: string }
  | { outcome: "skipped"; reason: string }; // lock failure

export const Agent = {} as any;

export const AgentInput = {} as any;

export const AgentOutput = {} as any;

export const JobResult = {} as any;

export const // eslint-disable-next-line @typescript-eslint/no-unused-vars
  WorkspacePolicyConfig = (props: any) => null;
export class // eslint-disable-next-line @typescript-eslint/no-unused-vars
  WorkspacePolicyConfigStub { static async execute() { return {}; } }

export const // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AgentInput = (props: any) => null;
export class // eslint-disable-next-line @typescript-eslint/no-unused-vars
  AgentInputStub { static async execute() { return {}; } }
