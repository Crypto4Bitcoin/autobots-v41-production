import { DBService } from "./supabase-service";
import { GovernanceService } from "./governance-service";

export class PackLifecycleService {
  /**
   * Installs a vertical pack into a workspace.
   */
  async installPack(workspaceId: string, packSlug: string, version?: string) {
    console.log(`[PackLifecycle] Installing pack: ${packSlug} for workspace: ${workspaceId}`);
    
    // 1. Verify existence
    const pack = await DBService.getVerticalPackBySlug(packSlug);
    if (!pack) throw new Error(`Pack not found: ${packSlug}`);

    // 2. Governance check
    await GovernanceService.assertPackInstallAllowed(workspaceId, packSlug);

    // 3. Perform installation
    const installVersion = version || pack.current_version;

    return DBService.installWorkspacePack({
      workspace_id: workspaceId,
      pack_id: pack.id,
      version: installVersion,
      status: "enabled"
    });
  }

  /**
   * Disables a pack for a workspace.
   */
  async disablePack(workspaceId: string, packSlug: string) {
    console.log(`[PackLifecycle] Disabling pack: ${packSlug} for workspace: ${workspaceId}`);
    
    const pack = await DBService.getVerticalPackBySlug(packSlug);
    if (!pack) throw new Error(`Pack not found: ${packSlug}`);

    return DBService.updateWorkspacePackInstall(
      workspaceId,
      pack.id,
      { status: "disabled" }
    );
  }

  /**
   * Upgrades a pack to a target version.
   */
  async upgradePack(workspaceId: string, packSlug: string, targetVersion: string) {
    console.log(`[PackLifecycle] Upgrading pack: ${packSlug} to v${targetVersion} for workspace: ${workspaceId}`);
    
    const pack = await DBService.getVerticalPackBySlug(packSlug);
    if (!pack) throw new Error(`Pack not found: ${packSlug}`);

    const versionExists = await DBService.checkPackVersionExists(pack.id, targetVersion);
    if (!versionExists) {
      throw new Error(`Version ${targetVersion} not found for pack ${packSlug}`);
    }

    return DBService.updateWorkspacePackInstall(
      workspaceId,
      pack.id,
      { version: targetVersion, status: "enabled" }
    );
  }
}
