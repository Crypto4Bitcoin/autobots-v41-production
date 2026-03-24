import { randomUUID } from "crypto"
import { PrototypePlan, PrototypeSandboxResult } from "./types"

export class PrototypeSandboxService {
  async test(plan: PrototypePlan): Promise<PrototypeSandboxResult> {
    const workflowPassRate = Math.max(0, Math.min(1, 0.88 - plan.estimatedBuildDays * 0.01))
    const apiReadiness = Math.max(0, Math.min(1, 0.84 - plan.requiredApis.length * 0.03))
    const failureHandlingScore = 0.73

    return {
      id: randomUUID(),
      conceptId: plan.conceptId,
      workflowPassRate,
      apiReadiness,
      failureHandlingScore,
      createdAt: new Date().toISOString(),
    }
  }
}
