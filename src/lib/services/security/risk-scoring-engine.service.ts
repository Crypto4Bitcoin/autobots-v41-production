export interface RiskFactor {
  type: string
  weight: number
}

export class RiskScoringEngine {
  async score(action: unknown): Promise<number> {
    let score = 0
    if (action.highPrivilege) score += 0.5
    if (action.externalImpact) score += 0.3
    if (action.unusualPattern) score += 0.2
    return Math.min(score, 1.0)
  }
}