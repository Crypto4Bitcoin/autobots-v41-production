import { DBService, supabase } from "./supabase-service";

export type GlobalStatus = "active" | "paused" | "drain_mode";

export class OperatorCommandConsole {
  /**
   * Sets the global operational status of the platform.
   */
  async setGlobalStatus(status: GlobalStatus, reason: string) {
    console.log(`[OperatorConsole] Setting global status to ${status.toUpperCase()}. Reason: ${reason}`);

    await supabase
      .from("control_plane_state")
      .update({ 
          global_status: status,
          updated_at: new Date().toISOString(),
          last_operator_reason: reason
      })
      .eq("id", "global");

    await DBService.logEvent({
      event_type: "control_plane_status_changed",
      workflow_run_id: "system",
      payload: { status, reason }
    });
  }

  /**
   * Emergency kill-switch for a specific workspace.
   */
  async throttleWorkspace(workspaceId: string, limit: number) {
    console.log(`[OperatorConsole] Throttling workspace ${workspaceId} to ${limit} concurrency.`);
    
    await supabase
      .from("workspace_controls")
      .update({ concurrency_limit: limit })
      .eq("workspace_id", workspaceId);
  }
}
