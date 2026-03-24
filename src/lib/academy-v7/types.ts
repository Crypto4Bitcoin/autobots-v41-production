export interface PrototypePlan {
  id: string
  conceptId: string
  category: string
  title: string
  requiredServices: string[]
  requiredApis: string[]
  requiredAgents: string[]
  estimatedBuildDays: number
  createdAt: string
}

export interface FeasibilityEstimate {
  id: string
  conceptId: string
  buildComplexity: number
  integrationComplexity: number
  maintenanceCost: number
  deliveryConfidence: number
  createdAt: string
}

export interface MarketValidationRecord {
  id: string
  conceptId: string
  searchDemand: number
  competitionPressure: number
  conversionLikelihood: number
  monetizationRealism: number
  createdAt: string
}

export interface PrototypeSandboxResult {
  id: string
  conceptId: string
  workflowPassRate: number
  apiReadiness: number
  failureHandlingScore: number
  createdAt: string
}

export interface PrototypeScoreRecord {
  id: string
  conceptId: string
  finalScore: number
  stage:
    | "prototype_candidate"
    | "prototype_in_progress"
    | "prototype_validated"
    | "prototype_rejected"
    | "prototype_ready_for_marketplace"
  createdAt: string
}

export interface PrototypeArchiveRecord {
  id: string
  conceptId: string
  title: string
  category: string
  plan: PrototypePlan
  feasibility: FeasibilityEstimate
  validation: MarketValidationRecord
  sandbox: PrototypeSandboxResult
  score: PrototypeScoreRecord
  governedAction: string
  archivedAt: string
}

export const FeasibilityEstimate = {} as any;

export const PrototypePlan = {} as any;

export const MarketValidationRecord = {} as any;

export const PrototypeArchiveRecord = {} as any;

export const PrototypeSandboxResult = {} as any;

export const PrototypeScoreRecord = {} as any;
