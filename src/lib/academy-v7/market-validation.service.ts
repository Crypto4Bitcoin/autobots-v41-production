import { randomUUID } from "crypto"
import { MarketValidationRecord } from "./types"

export class MarketValidationService {
  async validate(input: { conceptId: string; category: string; title: string }): Promise<MarketValidationRecord> {
    const searchDemand = /ai|crypto|automation|market/i.test(input.category) ? 0.82 : 0.58
    const competitionPressure = /ai|crypto/i.test(input.category) ? 0.72 : 0.44
    const conversionLikelihood = /subscription|marketplace|bot/i.test(input.title) ? 0.74 : 0.54
    const monetizationRealism = 0.68

    return {
      id: randomUUID(),
      conceptId: input.conceptId,
      searchDemand,
      competitionPressure,
      conversionLikelihood,
      monetizationRealism,
      createdAt: new Date().toISOString(),
    }
  }
}
