export class ConsensusService {
  /**
   * Resolves consensus between multiple agent outputs based on scores.
   * Identifies where disagreement is high and requires human escalation.
   */
  static resolve(outputs: Array<{ agentId: string; score: number; output: unknown }>) {
    console.log("[Consensus] Resolving multi-agent outputs...");
    
    if (!outputs.length) {
      throw new Error("No agent outputs provided for consensus resolution.");
    }

    // 1. Sort by score descending
    const sorted = [...outputs].sort((a, b) => b.score - a.score);
    const winner = sorted[0];

    // 2. Calculate Disagreement Delta
    // (Difference between top two scores)
    const disagreement = sorted.length > 1 
      ? Math.abs(sorted[0].score - sorted[1].score) 
      : 100;

    // 3. Threshold check (e.g., delta < 5 is high disagreement)
    const requiresEscalation = disagreement < 5;

    console.log(`[Consensus] Winner: ${winner.agentId} (Score: ${winner.score}). Disagreement Delta: ${disagreement}`);
    if (requiresEscalation) {
        console.warn("[Consensus] High disagreement detected! Human escalation recommended.");
    }

    return {
      winner,
      disagreement,
      requiresEscalation
    };
  }
}
