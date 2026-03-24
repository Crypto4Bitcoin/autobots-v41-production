import { supabase } from "./supabase-service";

export interface ScalingSignal {
  pool: string;
  action: "scale_up" | "scale_down" | "maintain";
  reason: string;
  metric_value: number;
}

export class WorkerAutoscalerService {
  private readonly QUEUE_DEPTH_THRESHOLD = 100;
  private readonly LATENCY_THRESHOLD_MS = 5000;

  /**
   * Analyzes platform metrics to generate scaling signals for the infrastructure layer.
   */
  async analyzeScaleSignals(): Promise<ScalingSignal[]> {
    console.log("[WorkerAutoscaler] Analyzing infrastructure load for scaling signals...");

    // 1. Check Queue Depth per pool
    // In a real system, we'd query job_queue grouped by worker_type
    const signals: ScalingSignal[] = [];

    const mockMetrics = [
      { pool: "general", depth: 150, latency: 2000 },
      { pool: "gpu-accelerated", depth: 10, latency: 100 }
    ];

    for (const metric of mockMetrics) {
      if (metric.depth > this.QUEUE_DEPTH_THRESHOLD) {
        signals.push({
          pool: metric.pool,
          action: "scale_up",
          reason: "queue_depth_exceeded_threshold",
          metric_value: metric.depth
        });
      } else if (metric.depth < 10) {
        signals.push({
          pool: metric.pool,
          action: "scale_down",
          reason: "underutilized_pool",
          metric_value: metric.depth
        });
      }
    }

    return signals;
  }

  /**
   * Triggers the actual infrastructure scaling event (e.g., K8s HPA or cloud provider API).
   */
  async executeScaling(signal: ScalingSignal) {
    console.log(`[WorkerAutoscaler] EXECUING: ${signal.action} for pool ${signal.pool}. Reason: ${signal.reason}`);
    
    await supabase.from("infrastructure_events").insert([{
      event_type: "autoscaling_triggered",
      payload: signal,
      created_at: new Date().toISOString()
    }]);
  }
}
