import { DBService } from "./supabase-service";

export class WorkflowTraceService {
  /**
   * Produces a human-readable timeline of workflow execution.
   */
  async getTimeline(workflowId: string) {
    console.log(`[WorkflowTrace] Generating timeline for workflow: ${workflowId}`);
    
    const events = await DBService.getWorkflowEvents(workflowId);
    
    const timeline = events.map(e => {
        let label = e.event_type.replace(/_/g, " ").toUpperCase();
        if (e.node_run_id) label = `[${e.node_run_id}] ${label}`;
        
        return {
            time: e.created_at,
            label,
            details: e.payload || {}
        };
    });

    return {
        workflow_id: workflowId,
        timeline,
        total_duration_ms: this.calculateDuration(events)
    };
  }

  private calculateDuration(events: unknown[]) {
      if (events.length < 2) return 0;
      const start = new Date(events[0].created_at).getTime();
      const end = new Date(events[events.length - 1].created_at).getTime();
      return end - start;
  }
}
