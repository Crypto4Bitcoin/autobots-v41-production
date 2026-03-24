export interface TradeoffInput {
  decisionId: string
  selectedOption: string
  sacrificed: string[]
  reason: string
}

export interface TradeoffExplanation {
  decisionId: string
  narrative: string
  timestamp: string
}

export class TradeoffTransparencyEngine {
  async explain(input: TradeoffInput): Promise<TradeoffExplanation> {
    const sacrificedText =
      input.sacrificed.length > 0 ? input.sacrificed.join(", ") : "no major priorities"

    return {
      decisionId: input.decisionId,
      narrative: `Selected "${input.selectedOption}" because ${input.reason}. Sacrificed: ${sacrificedText}.`,
      timestamp: new Date().toISOString(),
    }
  }
}