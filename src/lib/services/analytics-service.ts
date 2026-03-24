import { supabase } from "./supabase-service";

export interface CapabilityStats {
  capabilityKey: string;
  successRate: number;
  avgLatencyMs: number;
  totalRuns: number;
}

export class AnalyticsService {
  /**
   * Retrieves performance statistics for platform capabilities.
   */
  static async getCapabilityIntelligence(): Promise<CapabilityStats[]> {
    console.log("[AnalyticsService] Calculating capability intelligence...");
    
    // In a real implementation:
    // This would aggregation thousands of pipeline_events (completed vs failed)
    
    return [
      { capabilityKey: "search.web", successRate: 0.98, avgLatencyMs: 1200, totalRuns: 1540 },
      { capabilityKey: "video.edit", successRate: 0.85, avgLatencyMs: 45000, totalRuns: 210 },
      { capabilityKey: "social.publish", successRate: 0.92, avgLatencyMs: 2500, totalRuns: 540 }
    ];
  }

  /**
   * Detects operational bottlenecks in the orchestration queue.
   */
  static async detectBottlenecks(): Promise<{ bottleneckFound: boolean; hotspots: string[] }> {
    const { data: queueCounts } = await supabase
      .from("job_queue")
      .select("status, pipeline_items(title)")
      .eq("status", "pending");

    const pendingCount = queueCounts?.length || 0;
    const isBottleneck = pendingCount > 50; // Arbitrary threshold for demo

    return {
      bottleneckFound: isBottleneck,
      hotspots: isBottleneck ? ["High queue depth in social.publish jobs"] : []
    };
  }

  /**
   * Generates a cost report for a workspace.
   */
  static async getWorkspaceSpendingReport(workspaceId: string) {
    const { data: profile } = await supabase
      .from("workspace_governance_profiles")
      .select("current_monthly_spend_usd, max_monthly_budget_usd")
      .eq("workspace_id", workspaceId)
      .single();

    return {
      workspaceId,
      currentSpend: profile?.current_monthly_spend_usd || 0,
      limit: profile?.max_monthly_budget_usd || 100,
      utilization: (profile?.current_monthly_spend_usd || 0) / (profile?.max_monthly_budget_usd || 1)
    };
  }
}
