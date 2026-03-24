import { DBService } from "./supabase-service";

export class AgentReputationService {
  /**
   * Updates an agent's reputation metrics based on performance.
   */
  async updateMetrics(agentId: string, input: {
    success: boolean;
    latencyMs: number;
    reviewScore?: number;
    escalated?: boolean;
    costEfficiency?: number;
  }) {
    console.log(`[Reputation] Updating metrics for agent: ${agentId}`);
    
    // 1. Get current snapshot
    const current = await DBService.getAgentReputation(agentId);

    const totalRuns = (current?.total_runs || 0) + 1;
    const prevSuccessRate = Number(current?.success_rate || 0);
    const prevLatency = Number(current?.avg_latency_ms || 0);
    const prevReviewScore = Number(current?.avg_review_score || 0);
    const prevEscalation = Number(current?.escalation_rate || 0);
    const prevCostEfficiency = Number(current?.cost_efficiency || 0);

    // 2. Rolling Average Calculations
    const nextSuccessRate = ((prevSuccessRate * (totalRuns - 1)) + (input.success ? 1 : 0)) / totalRuns;
    const nextLatency = ((prevLatency * (totalRuns - 1)) + input.latencyMs) / totalRuns;
    const nextReviewScore = ((prevReviewScore * (totalRuns - 1)) + (input.reviewScore || 0)) / totalRuns;
    const nextEscalation = ((prevEscalation * (totalRuns - 1)) + (input.escalated ? 1 : 0)) / totalRuns;
    const nextCostEfficiency = ((prevCostEfficiency * (totalRuns - 1)) + (input.costEfficiency || 0)) / totalRuns;

    // 3. Persist Updated Metrics
    return DBService.upsertAgentReputation({
      agent_id: agentId,
      total_runs: totalRuns,
      success_rate: nextSuccessRate,
      avg_latency_ms: nextLatency,
      avg_review_score: nextReviewScore,
      escalation_rate: nextEscalation,
      cost_efficiency: nextCostEfficiency,
      updated_at: new Date().toISOString()
    });
  }
}
