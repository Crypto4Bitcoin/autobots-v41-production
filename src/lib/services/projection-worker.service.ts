import { ProjectionService } from "./projection.service";
import { DBService } from "./supabase-service";

export class AsynchronousProjectionWorker {
  private projection = new ProjectionService();

  /**
   * Simulates an asynchronous worker that processes event batches
   * to update optimized state projections.
   */
  async processEventBuffer() {
    console.log("[ProjectionWorker] Scanning for new events from backbone...");
    
    // 1. Get unprocessed events (simplified)
    const events = await DBService.getRecentEvents("workflow_completed", 10);

    for (const event of events) {
      if (!event.projection_updated) {
        console.log(`[ProjectionWorker] Updating projection for workflow: ${event.workflow_run_id}`);
        
        // 2. Rebuild State
        const state = await this.projection.rebuildWorkflowState(event.workflow_run_id);
        
        // 3. Update optimized view table
        await DBService.updateWorkflowProjection(event.workflow_run_id, state);
        
        // 4. Mark event as processed
        await DBService.markEventProjected(event.id);
      }
    }

    return { processed: events.length };
  }
}
