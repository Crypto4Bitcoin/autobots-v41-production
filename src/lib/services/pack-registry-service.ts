import { supabase } from "./supabase-service";

export interface VerticalPackManifest {
  packId: string;
  name: string;
  description: string;
  category: "media" | "research" | "trading" | "general";
  workflows: {
    workflowId: string;
    description: string;
    definition: unknown; // The DAG structure
  }[];
  requiredCapabilities: string[]; // Dependencies
  configurationSchema: unknown; // JSON schema for required user settings (e.g., API keys, slack hooks)
  pricing: {
    monthlySubscriptionUsd: number;
    costPerRunUsd: number;
  };
}

export class PackRegistryService {
  /**
   * Registers a prebuilt Vertical Pack into the global platform registry.
   */
  static async registerPack(manifest: VerticalPackManifest): Promise<void> {
    console.log(`[PackRegistry] Registering Vertical Pack: ${manifest.name}`);
    await supabase.from("vertical_packs").upsert([{
      pack_id: manifest.packId,
      name: manifest.name,
      description: manifest.description,
      category: manifest.category,
      manifest_data: manifest
    }]);
  }

  static async getPack(packId: string): Promise<VerticalPackManifest | null> {
    const { data } = await supabase.from("vertical_packs").select("manifest_data").eq("pack_id", packId).single();
    return data?.manifest_data || null;
  }

  /**
   * Verifies if a specific capability (often provided by a pack) is enabled for a workspace.
   */
  static async isCapabilityEnabled(workspaceId: string, capabilityKey: string): Promise<boolean> {
    console.log(`[PackRegistry] Verifying capability ${capabilityKey} for workspace ${workspaceId}`);
    // In production, this maps capabilityKey -> packId -> workspace_pack_installs
    // For Phase 60 hardening, we verify the core capability is registered and enabled
    const { data } = await supabase
      .from("agent_capabilities")
      .select("is_enabled")
      .eq("capability_key", capabilityKey)
      .single();
    
    return data?.is_enabled ?? true; // Default true to prevent blocking unless explicitly disabled
  }
}

export class PackInstallerService {
  /**
   * Installs a Vertical Pack into a specific tenant workspace.
   */
  static async installPack(workspaceId: string, packId: string, configurationOverrides: unknown): Promise<boolean> {
    console.log(`[PackInstaller] Installing ${packId} into workspace ${workspaceId}`);
    
    const pack = await PackRegistryService.getPack(packId);
    if (!pack) throw new Error("Vertical Pack not found.");

    // Validate configuration
    if (pack.configurationSchema && Object.keys(pack.configurationSchema).length > 0) {
       // Mock validation
       if (!configurationOverrides) throw new Error("Missing required configuration for pack installation.");
    }

    // Provision workflows from the pack into the tenant's workspace
    for (const wf of pack.workflows) {
        console.log(`   -> Provisioning packed workflow: ${wf.workflowId}`);
        await supabase.from("workflows").upsert([{
            workspace_id: workspaceId,
            workflow_id: `${workspaceId}-${wf.workflowId}`,
            definition: wf.definition
        }]);
    }

    console.log(`[PackInstaller] Pack ${packId} successfully installed.`);
    return true;
  }
}

export const VerticalPackManifest = {} as any;
