import { supabase } from "./supabase-service";

export interface GovernanceProfile {
  workspaceId: string;
  enabledPackSlugs: string[];
  allowedTrustTier: number;
  maxMonthlyBudgetUsd: number;
  currentMonthlySpendUsd: number;
  enforceHumanApprovalAboveTier: number;
  voiceTriggerEnabled: boolean;
  autonomousExecutionEnabled: boolean;
  restrictedCapabilityKeys: string[];
  deniedPacks?: string[];
}

export class GovernanceService {
  /**
   * Asserts that a pack installation is allowed for a workspace.
   */
  static async assertPackInstallAllowed(workspaceId: string, packSlug: string) {
    const profile = await this.getProfile(workspaceId);

    const deniedPacks = profile?.deniedPacks || [];
    if (deniedPacks.includes(packSlug)) {
      throw new Error(`Pack ${packSlug} is not allowed for workspace ${workspaceId}`);
    }

    return true;
  }
  /**
   * Retrieves the governance profile for a workspace.
   */
  static async getProfile(workspaceId: string): Promise<GovernanceProfile | null> {
    const { data, error } = await supabase
      .from("workspace_governance_profiles")
      .select("*")
      .eq("workspace_id", workspaceId)
      .single();

    if (error || !data) return null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any as GovernanceProfile;
  }

  /**
   * Validates if a capability execution is permitted under current governance.
   */
  static async validateExecution(
    workspaceId: string, 
    capabilityKey: string, 
    trustTier: number
  ): Promise<{ allowed: boolean; reason?: string; requiresReview?: boolean }> {
    const profile = await this.getProfile(workspaceId);
    
    // Default fallback if no profile exists
    if (!profile) {
      if (trustTier > 2) return { allowed: false, reason: "No governance profile found. Tier 3+ restricted." };
      return { allowed: true };
    }

    // 1. Check Restricted Keys
    const restrictedKeys = profile.restrictedCapabilityKeys || [];
    if (restrictedKeys.includes(capabilityKey)) {
      return { allowed: false, reason: `Capability ${capabilityKey} is explicitly restricted for this workspace.` };
    }

    // 2. Check Trust Tier Limit
    const allowedTier = profile.allowedTrustTier || 2;
    if (trustTier > allowedTier) {
      return { allowed: false, reason: `Trust Tier ${trustTier} exceeds the workspace allowed limit of ${allowedTier}.` };
    }

    // 3. Check Budget
    const currentSpend = profile.currentMonthlySpendUsd || 0;
    const maxBudget = profile.maxMonthlyBudgetUsd || 100;
    if (currentSpend >= maxBudget) {
      return { allowed: false, reason: "Monthly budget exceeded." };
    }

    // 4. Check Mandatory Review
    const reviewThreshold = profile.enforceHumanApprovalAboveTier || 3;
    const requiresReview = trustTier >= reviewThreshold;

    return { allowed: true, requiresReview };
  }

  /**
   * Records spend for a workspace.
   */
  static async recordSpend(workspaceId: string, amountUsd: number) {
    await supabase.rpc("increment_workspace_spend", { w_id: workspaceId, amount: amountUsd });
  }
}
