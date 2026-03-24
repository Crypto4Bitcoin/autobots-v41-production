import { DBService } from "./supabase-service";

export type AutonomyMode = "manual" | "assisted" | "supervised" | "semi_autonomous" | "fully_autonomous";

export class AutonomyModeService {
  /**
   * Sets the autonomy level for a specific scope (workspace, pack, workflow).
   */
  async setAutonomyMode(scope: { workspaceId: string; packSlug?: string }, mode: AutonomyMode) {
    console.log(`[AutonomyMode] Setting autonomy to ${mode} for scope: ${JSON.stringify(scope)}`);
    
    // In production, this persists to 'autonomy_profiles'
    const result = await DBService.upsertAutonomyProfile({
      ...scope,
      mode,
      updated_at: new Date().toISOString()
    });

    await DBService.logEvent({
      event_type: "autonomy_mode_changed",
      workspace_id: scope.workspaceId,
      payload: { scope, mode }
    });

    return result;
  }

  /**
   * Resolves the effective autonomy level for a given context.
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resolveMode(workspaceId: string, packSlug?: string): Promise<AutonomyMode> {
    // 1. Check pack override
    // 2. Fallback to workspace default
    return "supervised"; // Mock default
  }
}
