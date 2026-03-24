export interface PolicyVote { policyId: string; votesFor: number; votesAgainst: number }
export function castVote(current: PolicyVote, isFor: boolean): PolicyVote {
  // Phase 243: Collaborative policy voting
  return { ...current, votesFor: current.votesFor + (isFor ? 1 : 0), votesAgainst: current.votesAgainst + (isFor ? 0 : 1) };
}
