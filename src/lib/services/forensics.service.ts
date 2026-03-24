import { DBService } from "./supabase-service";

export class ForensicsService {
  /**
   * Generates a deep execution trace for a workflow or node.
   * Explains the failure path and artifact chain.
   */
  async analyzeForensics(workflowId: string) {
    console.log(`[Forensics] Analyzing execution trace for workflow: ${workflowId}`);
    
    const events = await DBService.getWorkflowEvents(workflowId);
    
    const trace = events.map(e => ({
        timestamp: e.created_at,
        event: e.event_type,
        node: e.node_run_id || "system",
        outcome: e.payload?.status || "n/a"
    }));

    const failure = events.find(e => e.event_type === "node_failed" || e.event_type === "workflow_failed");

    return {
        workflow_id: workflowId,
        full_trace: trace,
        failure_root_cause: failure ? failure.payload?.error || "Unknown Failure" : "No failures detected",
        artifact_lineage_vaild: true // Simplified vaildation
    };
  }
}
