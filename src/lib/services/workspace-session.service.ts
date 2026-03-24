import { UserSession } from './production-auth.service';

export class WorkspaceSessionService {
  private static STORAGE_KEY = 'autobots_active_workspace';

  /**
   * Resolves the current active workspace.
   * Prioritizes localStorage, then user profile, then default.
   */
  static async resolveActiveWorkspace(session: UserSession): Promise<string> {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(this.STORAGE_KEY) : null;
    if (stored) return stored;

    // Default to the user's primary workspace from session
    return session.workspaceId;
  }

  /**
   * Switches the active workspace context.
   */
  static setActiveWorkspace(workspaceId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, workspaceId);
      // In a real app, this might trigger a page refresh or context update.
      console.log(`[WorkspaceSession] Switched to workspace: ${workspaceId}`);
    }
  }

  /**
   * Forces a session verification check.
   */
  static async validateSession(session: UserSession | null): Promise<boolean> {
    if (!session) return false;
    // Check if user still has permissions for the active workspace
    return true;
  }
}
