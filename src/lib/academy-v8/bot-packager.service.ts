import { randomUUID } from "crypto"
import { BotProductRecord } from "./types"

export class BotPackagerService {
  async package(input: { prototypeId: string; title: string; category: string }) {
    return {
      id: randomUUID(),
      prototypeId: input.prototypeId,
      title: input.title,
      category: input.category,
      deploymentTemplate: "",
      pricingTier: "starter" as const,
      readinessScore: 0,
      supportState: "draft" as const,
      createdAt: new Date().toISOString(),
    } satisfies BotProductRecord
  }
}
