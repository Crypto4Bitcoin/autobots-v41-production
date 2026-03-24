import { supabase } from "./supabase-service";

export interface RadarSignal {
  active_workflows: number;
  blocked_nodes: number;
  dead_letter_count: number;
  anomalies: string[];
}

export class WorkflowRadarService {
  /**
   * Scans for high-level operational signals across the workflow execution plane.
   */
  async getRadarSignals(): Promise<RadarSignal> {
    console.log("[WorkflowRadar] Sweeping for operational signals...");

    const [activeRes, blockedRes, dlqRes] = await Promise.all([
      supabase.from("workflow_runs").select("id", { count: "exact" }).eq("status", "running"),
      supabase.from("node_runs").select("id", { count: "exact" }).eq("status", "pending"), // Blocked can be simplified to pending for this mock
      supabase.from("job_queue").select("id", { count: "exact" }).eq("status", "dead_letter")
    ]);

    const signals: RadarSignal = {
      active_workflows: activeRes.count || 0,
      blocked_nodes: blockedRes.count || 0,
      dead_letter_count: dlqRes.count || 0,
      anomalies: []
    };

    if (signals.dead_letter_count > 50) {
        signals.anomalies.push("Critical DLQ Spike detected.");
    }

    return signals;
  }
}
