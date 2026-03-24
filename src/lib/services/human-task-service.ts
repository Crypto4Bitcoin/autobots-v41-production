import { supabase } from "./supabase-service";
import { WorkflowEngine } from "./workflow-engine";

export class HumanTaskService {
  /**
   * Creates a human intervention task for a workflow node.
   */
  static async createRequest(params: {
    workflowRunId: string;
    nodeRunId: string;
    workspaceId: string;
    instructions: string;
    inputData: unknown;
  }) {
    const { data, error } = await supabase
      .from("human_tasks")
      .insert([{
        workflow_run_id: params.workflowRunId,
        node_run_id: params.nodeRunId,
        workspace_id: params.workspaceId,
        instructions: params.instructions,
        input_data: params.inputData,
        status: "pending"
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Resolves a human task, unblocking the downstream DAG.
   */
  static async resolveTask(taskId: string, resolution: unknown, reviewerNotes?: string) {
    const { data: task, error: fetchErr } = await supabase
      .from("human_tasks")
      .select("*")
      .eq("id", taskId)
      .single();

    if (fetchErr || !task) throw fetchErr || new Error("Task not found");

    const { error: updateErr } = await supabase
      .from("human_tasks")
      .update({
        status: "resolved",
        resolution_payload: resolution,
        reviewer_notes: reviewerNotes,
        resolved_at: new Date().toISOString()
      })
      .eq("id", taskId);

    if (updateErr) throw updateErr;

    // Unblock the workflow
    await WorkflowEngine.completeNode(task.node_run_id, "completed");
    await WorkflowEngine.projectWorkflowStatus(task.workflow_run_id);
    
    return true;
  }
}
