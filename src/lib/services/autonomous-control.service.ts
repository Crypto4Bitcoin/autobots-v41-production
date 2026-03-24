export class AutonomousControlService {
  private static globalEnabled = true;
  private static workspaceState: Map<string, 'active' | 'paused'> = new Map();

  static setGlobalAutonomy(enabled: boolean) {
    this.globalEnabled = enabled;
    console.log(`[AutonomousControl] GLOBAL autonomy set to ${enabled}`);
  }

  static setWorkspaceAutonomy(workspaceId: string, state: 'active' | 'paused') {
    this.workspaceState.set(workspaceId, state);
    console.log(`[AutonomousControl] Workspace ${workspaceId} autonomy set to ${state}`);
  }

  static isAutonomyAllowed(workspaceId: string): boolean {
    if (!this.globalEnabled) return false;
    return this.workspaceState.get(workspaceId) !== 'paused';
  }
}
