import { randomUUID } from "crypto"
import { PrototypePlan } from "./types"

export class PrototypePlannerService {
  async plan(input: { conceptId: string; category: string; title: string }): Promise<PrototypePlan> {
    return {
      id: randomUUID(),
      conceptId: input.conceptId,
      category: input.category,
      title: input.title,
      requiredServices: ["memory", "prediction", "autopost", "analytics"],
      requiredApis: ["search", "generation", "publish"],
      requiredAgents: ["PrototypePlannerAgent", "PrototypeSandboxAgent", "IncubationGovernorAgent"],
      estimatedBuildDays: input.category === "ai" ? 10 : 7,
      createdAt: new Date().toISOString(),
    }
  }
}
