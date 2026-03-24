import { DBService } from "./supabase-service";

export class AgentCoordinatorService {
  /**
   * Assigns an active agent to a workflow node based on a required role.
   */
  async assignAgent(params: {
    workspaceId: string;
    workflowRunId?: string;
    nodeRunId?: string;
    requiredRole: string;
  }) {
    console.log(`[AgentCoordinator] Finding candidate for role: ${params.requiredRole} in workspace: ${params.workspaceId}`);
    
    // 1. Fetch candidates from DB
    const candidates = await DBService.listActiveAgentsByRole(
      params.workspaceId,
      params.requiredRole
    );

    if (!candidates || candidates.length === 0) {
      throw new Error(`No active agents available for role: ${params.requiredRole}`);
    }

    // 2. Selection Strategy (Simple: First available)
    // Future expansion: Select based on reputation/load
    const agent = candidates[0];

    // 3. Persist Assignment
    await DBService.createAgentAssignment({
      workflow_run_id: params.workflowRunId,
      node_run_id: params.nodeRunId,
      agent_id: agent.id,
      assigned_by: "system",
      assignment_type: "role_based",
      status: "assigned"
    });

    console.log(`[AgentCoordinator] Assigned agent ${agent.name} (ID: ${agent.id}) to role ${params.requiredRole}`);
    return agent;
  }
}
