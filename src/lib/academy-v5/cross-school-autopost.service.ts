
import { randomUUID } from "crypto"
import { NetworkPostPlan } from "./types"

export class CrossSchoolAutopostService {
  private static plans: NetworkPostPlan[] = []

  async coordinate(input: Omit<NetworkPostPlan, "id" | "createdAt">) {
    const plan: NetworkPostPlan = {
      id: randomUUID(),
      schoolId: input.schoolId,
      platform: input.platform,
      assetTitle: input.assetTitle,
      scheduledAt: input.scheduledAt,
      priorityScore: input.priorityScore,
      createdAt: new Date().toISOString(),
    }

    CrossSchoolAutopostService.plans.unshift(plan)
    return plan
  }

  async list() {
    return [...CrossSchoolAutopostService.plans].sort(
      (a, b) => b.priorityScore - a.priorityScore
    )
  }
}
