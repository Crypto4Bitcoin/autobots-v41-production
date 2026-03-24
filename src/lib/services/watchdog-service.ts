import { DBService } from "./supabase-service";
import { PipelineState } from "@/lib/types/enums";

export class WatchdogService {
  private static checkInterval = 60000; // 1 minute
  private static stallThresholdMs = 300000; // 5 minutes
  private static isRunning = false;

  static start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("[Watchdog] Started state recovery service.");
    this.check();
  }

  private static async check() {
    while (this.isRunning) {
      try {
        console.log("[Watchdog] Scanning for stalled jobs...");
        
        // 1. Find jobs in 'processing' state for too long
        const stalledTime = new Date(Date.now() - this.stallThresholdMs).toISOString();
        
// eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data: stalledJobs, error } = await DBService.fetchStalledJobs(stalledTime);
        
        if (stalledJobs && stalledJobs.length > 0) {
          for (const job of stalledJobs) {
            console.warn(`[Watchdog] Recovering stalled job ${job.id} for ${job.pipeline_item_id}`);
            
            if (job.attempts >= job.max_attempts) {
              await DBService.updateJobStatus(job.id, "failed", "Max attempts reached via Watchdog");
              await DBService.updatePipelineState(job.pipeline_item_id, PipelineState.FAILED);
            } else {
              // Reset to pending for retry
              await DBService.updateJobStatus(job.id, "pending", "Watchdog recovery");
            }
          }
        }

        // 2. Clear expired locks
        await DBService.clearExpiredLocks();

      } catch (err) {
        console.error("[Watchdog] Run failed:", err);
      }
      
      await new Promise(resolve => setTimeout(resolve, this.checkInterval));
    }
  }

  static stop() {
    this.isRunning = false;
  }
}
