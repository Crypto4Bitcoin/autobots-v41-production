import { DBService } from "./supabase-service";

export class SupervisorService {
  /**
   * Escalates a workforce issue to a human operator.
   * Used when consensus fails, roles are missing, or high-risk anomalies occur.
   */
  async escalateIfNeeded(params: {
    workflowRunId: string;
    reason: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
  }) {
    console.warn(`[Supervisor] Escalating to human: ${params.reason} (Workflow: ${params.workflowRunId})`);
    
    return DBService.createHumanTask({
      workflow_run_id: params.workflowRunId,
      instructions: `Supervisor escalation required: ${params.reason}`,
      status: "pending",
      resolution_payload: params.metadata || {}
    });
  }
}
