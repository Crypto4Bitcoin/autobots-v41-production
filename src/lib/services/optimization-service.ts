import { DBService } from "./supabase-service";
import { MemoryService } from "./memory-service";

export interface TuningMetrics {
  providerPerformance: Record<string, {
    avgScore: number;
    count: number;
    lastChecked: string;
  }>;
  recommendedBias: Record<string, "boost" | "neutral" | "demote">;
  lastUpdated: string;
}

const MIN_SAMPLES = 5; // Minimum feedback items before a pivot
const COOLDOWN_MS = 60 * 60 * 1000; // 1 hour cooldown between metric recalculations

export class OptimizationService {
  /**
   * Scans recent artifact feedback and updates tuning metrics in workspace memory.
   */
  static async updateTuningMetrics(workspaceId: string, force = false) {
    // 0. Check Cooldown
    const latest = await this.getLatestMetrics(workspaceId);
    if (!force && latest && (Date.now() - new Date(latest.lastUpdated).getTime() < COOLDOWN_MS)) {
      console.log(`[Optimization] Cooldown active for ${workspaceId}. Skipping update.`);
      return latest;
    }

    console.log(`[Optimization] Regenerating tuning metrics for ${workspaceId}...`);
    
    // 1. Fetch recent feedback (last 50 items for example)
    // We'd ideally join with artifacts to get agent/provider info
    // For this pilot, we'll assume we can pull enough info from audit logs or similar if needed,
    // but here we'll just pull directly from public.agent_runs joined with feedback if possible.
    
    // Simplification: We'll aggregate based on agent_name from agent_runs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: recentRuns, error } = await (DBService as any).supabase
      .from("agent_runs")
      .select(`
        id,
        agent_name,
        output_data,
        status,
        latency_ms,
        artifacts (
          id,
          artifact_feedback (
            score
          )
        )
      `)
      .eq("workspace_id", workspaceId)
      .eq("status", "success")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("[Optimization] Error fetching recent runs:", error);
      return;
    }

    const performance: Record<string, { totalScore: number; count: number }> = {};

    recentRuns?.forEach((run: unknown) => {
      const agent = run.agent_name;
      // Get score from the first artifact's first feedback (simplification)
      const score = run.artifacts?.[0]?.artifact_feedback?.[0]?.score;
      
      if (score !== undefined) {
        if (!performance[agent]) performance[agent] = { totalScore: 0, count: 0 };
        performance[agent].totalScore += score;
        performance[agent].count += 1;
      }
    });

    const now = new Date().toISOString();
    const metrics: TuningMetrics = {
      providerPerformance: {},
      recommendedBias: {},
      lastUpdated: now
    };

    for (const [agent, data] of Object.entries(performance)) {
      const avg = data.totalScore / data.count;
      metrics.providerPerformance[agent] = {
        avgScore: avg,
        count: data.count,
        lastChecked: now
      };

      if (avg < 50 && data.count >= MIN_SAMPLES) {
        metrics.recommendedBias[agent] = "demote";
      } else if (avg > 85 && data.count >= MIN_SAMPLES) {
        metrics.recommendedBias[agent] = "boost";
      } else {
        metrics.recommendedBias[agent] = "neutral";
      }
    }

    // 2. Persist to MemoryService
    await MemoryService.recordPattern(
      workspaceId,
      "tuning_metrics",
      "latest",
      metrics
    );

    console.log(`[Optimization] Metrics updated for ${workspaceId}:`, metrics.recommendedBias);
    return metrics;
  }

  static async getLatestMetrics(workspaceId: string): Promise<TuningMetrics | null> {
    const memories = await MemoryService.getPatterns(workspaceId, "tuning_metrics");
    if (memories && memories.length > 0) {
      // Find the one with pattern_key = 'latest' or just get the first one
      const record = memories.find((m: unknown) => m.pattern_key === "latest") || memories[0];
      return record.pattern_data as TuningMetrics;
    }
    return null;
  }
}

export const TuningMetrics = {} as any;
