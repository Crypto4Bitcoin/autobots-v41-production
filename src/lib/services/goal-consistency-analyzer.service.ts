export interface GoalCheckInput {
  proposalId: string
  summary: string
  impacts: string[]
}

export interface GoalCheckResult {
  proposalId: string
  aligned: boolean
  blockedBy: string[]
  explanation: string
  timestamp: string
}

export class GoalConsistencyAnalyzer {
  async analyze(input: GoalCheckInput): Promise<GoalCheckResult> {
    const blockedBy: string[] = []

    if (input.impacts.some((x) => x.toLowerCase().includes("reduced legibility"))) {
      blockedBy.push("Legibility")
    }

    return {
      proposalId: input.proposalId,
      aligned: blockedBy.length === 0,
      blockedBy,
      explanation:
        blockedBy.length === 0
          ? "Proposal is aligned with registered strategic intents."
          : `Proposal conflicts with: ${blockedBy.join(", ")}.`,
      timestamp: new Date().toISOString(),
    }
  }
}