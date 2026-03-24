export interface WorkspacePolicy {
  approvalRequired: boolean;
  blockedProviders: string[]; // [HARDENING] Ability to block providers entirely
  allowedProviders: string[];
  restrictedRoles: string[];
  draftOnlyMode: boolean;
  voiceActionRestriction: 'unrestricted' | 'approval_mandatory' | 'blocked';
}

export class WorkspacePolicyService {
  /**
   * [HARDENING] Ensures workspace policies can block providers entirely (e.g. no LinkedIn).
   */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getPolicy(workspaceId: string): Promise<WorkspacePolicy> {
    return {
      approvalRequired: true,
      blockedProviders: ['youtube'], // Example: YouTube is forbidden globally here
      allowedProviders: ['x', 'slack', 'linkedin'],
      restrictedRoles: ['viewer'],
      draftOnlyMode: true,
      voiceActionRestriction: 'approval_mandatory'
    };
  }

  static async isActionPermitted(workspaceId: string, actionType: string, provider: string, triggeredBy: 'ui' | 'voice'): Promise<{ allowed: boolean; reason?: string }> {
    const policy = await this.getPolicy(workspaceId);
    
    if (policy.blockedProviders.includes(provider)) {
      return { allowed: false, reason: `Provider ${provider} is explicitly BLOCKED in this workspace.` };
    }

    if (triggeredBy === 'voice' && policy.voiceActionRestriction === 'blocked') {
      return { allowed: false, reason: 'Voice actions are globally disabled in this workspace.' };
    }

    return { allowed: true };
  }
}
