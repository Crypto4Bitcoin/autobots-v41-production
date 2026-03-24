import { randomUUID } from "crypto"
import { FeasibilityEstimate, PrototypePlan } from "./types"

export class FeasibilityEstimatorService {
  async estimate(plan: PrototypePlan): Promise<FeasibilityEstimate> {
    const buildComplexity = Math.min(1, 0.35 + plan.requiredServices.length * 0.08)
    const integrationComplexity = Math.min(1, 0.3 + plan.requiredApis.length * 0.1)
    const maintenanceCost = Math.min(1, 0.2 + plan.requiredAgents.length * 0.07)
    const deliveryConfidence = Math.max(0, Math.min(1, 0.9 - buildComplexity * 0.25 - integrationComplexity * 0.2))

    return {
      id: randomUUID(),
      conceptId: plan.conceptId,
      buildComplexity,
      integrationComplexity,
      maintenanceCost,
      deliveryConfidence,
      createdAt: new Date().toISOString(),
    }
  }
}
