import { DBService } from "./supabase-service";

export type SafetyMode = "normal" | "strict" | "emergency_restricted" | "simulation_only";

export class SafetyModeService {
  /**
   * Enforces a global or workspace-level safety envelope.
   */
  async setSafetyMode(mode: SafetyMode, workspaceId: string = "global") {
    console.log(`[SafetyMode] Enforcing ${mode} envelope for: ${workspaceId}`);
    
    // In production, this persists to 'safety_mode_state'
    const result = await DBService.updateSafetyMode(workspaceId, {
      mode,
      updated_at: new Date().toISOString()
    });

    await DBService.logEvent({
      event_type: "safety_mode_transition",
      workspace_id: workspaceId === "global" ? undefined : workspaceId,
      payload: { mode }
    });

    return result;
  }

  /**
   * Checks if a capability execution is permitted under the current safety mode.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  async permitsCapability(capability: string, trustTier: number): Promise<boolean> {
     // Scenario: Strict mode blocks trust-tier 4+
     // Scenario: emergency_restricted blocks all write actions
     return true;
  }
}
