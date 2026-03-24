import { DBService } from "./supabase-service";

export interface ControlPlaneState {
  global_status: "active" | "paused" | "drain";
  maintenance_mode: boolean;
  throttle_level: number; // 0-100
  emergency_trust_gate: number; // 0-5
}

export class ControlPlaneService {
  /**
   * Updates global platform operational state.
   */
  async updateGlobalState(patch: Partial<ControlPlaneState>) {
    console.log(`[ControlPlane] Applying global state update: ${JSON.stringify(patch)}`);
    
    // In production, this persists to 'control_plane_state'
    const result = await DBService.updateControlState(patch);
    
    // Emit audit event
    await DBService.logEvent({
      event_type: "control_plane_state_change",
      payload: { patch, timestamp: new Date().toISOString() }
    });

    return result;
  }

  /**
   * Pauses execution for a specific workspace.
   */
  async pauseWorkspace(workspaceId: string) {
    console.log(`[ControlPlane] Pausing execution for workspace: ${workspaceId}`);
    return DBService.updateWorkspaceControl(workspaceId, { status: "paused" });
  }

  /**
   * Resumes execution for a specific workspace.
   */
  async resumeWorkspace(workspaceId: string) {
    console.log(`[ControlPlane] Resuming execution for workspace: ${workspaceId}`);
    return DBService.updateWorkspaceControl(workspaceId, { status: "active" });
  }
}
