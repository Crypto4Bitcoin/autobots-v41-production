export type OmegaSeverity = "low" | "medium" | "high" | "critical"

export interface OmegaSignal {
  id: string
  domain: "reliability" | "governance" | "evolution" | "simulation"
  type: string
  severity: OmegaSeverity
  detail: string
  timestamp: string
}

export interface OmegaDecision {
  id: string
  allowed: boolean
  action: "allow" | "repair" | "block" | "replay" | "escalate"
  reason: string
  timestamp: string
}

export const OmegaDecision = {} as any;

export const OmegaSignal = {} as any;
