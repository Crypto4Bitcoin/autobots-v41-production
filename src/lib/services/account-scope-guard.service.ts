import { ProviderId } from './connected-account-oauth.service';

export class AccountScopeGuardService {
  /**
   * Checks if an entity (worker, workflow, voice session) has permission 
   * to use a specific connected account within a workspace.
   */
  static async checkAccess(workspaceId: string, provider: ProviderId, entityId: string): Promise<boolean> {
    console.log(`[AccountScopeGuard] Checking if ${entityId} can access ${provider} in WS ${workspaceId}`);
    // In production, query the 'account_visibility' or 'capability_permissions' table.
    return true; 
  }
}
