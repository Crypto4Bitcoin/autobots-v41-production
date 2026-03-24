export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  packSlug: string;
  capabilityIds: string[];
  suggestedDag: unknown; // Minimal DAG structure
}

export interface RecommendationResult {
  type: "template" | "pack" | "assembly";
  targetId?: string;
  displayName: string;
  reason: string;
  confidence: number;
}

export interface AssemblyProposal {
  draftDag: unknown;
  explanation: string;
  warnings: string[];
  isGoverned: boolean;
}

export const AssemblyProposal = {} as any;

export const RecommendationResult = {} as any;

export const WorkflowTemplate = {} as any;
