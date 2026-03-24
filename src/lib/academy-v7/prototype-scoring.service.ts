import { randomUUID } from "crypto"
import { FeasibilityEstimate, MarketValidationRecord, PrototypeSandboxResult, PrototypeScoreRecord } from "./types"

export class PrototypeScoringService {
  async score(input: { conceptId: string; feasibility: FeasibilityEstimate; validation: MarketValidationRecord; sandbox: PrototypeSandboxResult }): Promise<PrototypeScoreRecord> {
    const finalScore =
      (1 - input.feasibility.buildComplexity) * 0.18 +
      input.feasibility.deliveryConfidence * 0.17 +
      input.validation.searchDemand * 0.18 +
      (1 - input.validation.competitionPressure) * 0.08 +
      input.validation.conversionLikelihood * 0.14 +
      input.validation.monetizationRealism * 0.1 +
      input.sandbox.workflowPassRate * 0.1 +
      input.sandbox.apiReadiness * 0.03 +
      input.sandbox.failureHandlingScore * 0.02

    const stage =
      finalScore >= 0.82
        ? "prototype_ready_for_marketplace"
        : finalScore >= 0.7
        ? "prototype_validated"
        : finalScore >= 0.56
        ? "prototype_in_progress"
        : "prototype_rejected"

    return {
      id: randomUUID(),
      conceptId: input.conceptId,
      finalScore: Number(finalScore.toFixed(3)),
      stage,
      createdAt: new Date().toISOString(),
    }
  }
}
