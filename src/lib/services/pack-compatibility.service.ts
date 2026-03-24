export class PackCompatibilityService {
  /**
   * Validates the structure of a pack manifest.
   */
  static validateManifest(manifest: unknown) {
    if (!manifest) throw new Error("Pack manifest missing");
    
    if (!manifest.capabilities || !Array.isArray(manifest.capabilities)) {
      throw new Error("Pack manifest must declare 'capabilities' as an array.");
    }
    
    if (!manifest.workflows || !Array.isArray(manifest.workflows)) {
      throw new Error("Pack manifest must declare 'workflows' as an array.");
    }

    return true;
  }

  /**
   * Validates if a pack is compatible with a workspace's governance profile.
   */
  static validateWorkspaceCompatibility(manifest: unknown, workspaceProfile: unknown) {
    const requiredTier = manifest.required_trust_tier || 1;
    const workspaceTier = workspaceProfile.max_trust_tier || workspaceProfile.allowedTrustTier || 1;

    if (requiredTier > workspaceTier) {
      throw new Error(`Workspace trust tier (${workspaceTier}) is too low for this pack (requires Tier ${requiredTier}).`);
    }

    return true;
  }
}
