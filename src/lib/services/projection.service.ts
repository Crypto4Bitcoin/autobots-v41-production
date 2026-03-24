import { DBService } from "./supabase-service";

export interface ProjectionState {
  status: string;
  nodesCompleted: string[];
  artifacts: string[];
  startTime: string | null;
  endTime: string | null;
  lastEventAt: string | null;
}

export class ProjectionService {
  /**
   * Rule: Deterministic Mutation.
   * This is the single authoritative method for mutating state from an event.
   */
  applyEvent(state: ProjectionState, event: unknown): ProjectionState {
    state.lastEventAt = event.created_at;

    switch (event.event_type) {
      case "workflow_started":
        state.status = "running";
        state.startTime = event.created_at;
        break;
      case "node_completed":
        // Supporting both schema patterns (node_run_id and payload.node_id)
        const nodeId = event.node_run_id || event.payload?.node_id;
        if (nodeId) state.nodesCompleted.push(nodeId);
        break;
      case "artifact_created":
        const artifactId = event.artifact_id || event.payload?.artifact_id;
        if (artifactId) state.artifacts.push(artifactId);
        break;
      case "workflow_completed":
        state.status = "completed";
        state.endTime = event.created_at;
        break;
      case "workflow_failed":
        state.status = "failed";
        state.endTime = event.created_at;
        break;
    }
    return state;
  }

  /**
   * Rebuilds the operational state of a workflow by replaying its event log.
   */
  async rebuildWorkflowState(workflowId: string): Promise<ProjectionState> {
    console.log(`[Projection] Rebuilding state for workflow: ${workflowId}`);
    
    const events = await DBService.getWorkflowEvents(workflowId);

    let state: ProjectionState = {
      status: "pending",
      nodesCompleted: [],
      artifacts: [],
      startTime: null,
      endTime: null,
      lastEventAt: null
    };

    for (const event of events) {
        state = this.applyEvent(state, event);
    }

    console.log(`[Projection] Reconstruction complete. Status: ${state.status}, Nodes: ${state.nodesCompleted.length}`);
    return state;
  }

  /**
   * Rule 1: Event Authority Audit.
   */
  async verifyEventAuthority(workflowId: string, projection: unknown) {
    const events = await DBService.getWorkflowEvents(workflowId);
    
    if (projection && events.length === 0) {
        return { status: "drift_detected", error: "Projection state exists without event history (Event Authority Breach)." };
    }

    return { status: "aligned", event_count: events.length };
  }
}
