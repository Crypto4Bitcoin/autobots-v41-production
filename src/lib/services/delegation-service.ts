import { DBService } from "./supabase-service";

export class DelegationService {
  /**
   * Creates a subtask for inter-agent delegation.
   */
  async createSubtask(params: {
    workflowRunId: string;
    parentNodeRunId: string;
    assignedAgentId?: string;
    taskType: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputPayload: Record<string, any>;
  }) {
    console.log(`[Delegation] Creating subtask (${params.taskType}) for parent node: ${params.parentNodeRunId}`);
    
    return DBService.createSubtask({
      workflow_run_id: params.workflowRunId,
      parent_node_run_id: params.parentNodeRunId,
      assigned_agent_id: params.assignedAgentId || null,
      task_type: params.taskType,
      status: "pending",
      input_payload: params.inputPayload
    });
  }

  /**
   * Marks a subtask as complete with output logic.
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  async completeSubtask(subtaskId: string, outputPayload: Record<string, any>) {
    console.log(`[Delegation] Completing subtask: ${subtaskId}`);
    
    return DBService.updateSubtask(subtaskId, {
      status: "completed",
      output_payload: outputPayload,
      completed_at: new Date().toISOString()
    });
  }
}
