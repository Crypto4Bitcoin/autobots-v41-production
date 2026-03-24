import { PackRegistryService } from "./pack-registry-service";
import { supabase } from "./supabase-service";

export interface CapabilityRegistration {
  key: string;
  displayName: string;
  description: string;
  runtimeType: 'internal_agent' | 'tool_adapter';
  trustTier: 1 | 2 | 3 | 4;
}

export interface PackRegistration {
  name: string;
  slug: string; // Used as packId in the manifest
  version: string;
  manifest: unknown;
  capabilityKeys: string[];
}

export class PlatformSDK {
  /**
   * Registers a new platform capability with the governance system.
   */
  static async registerCapability(reg: CapabilityRegistration) {
    console.log(`[PlatformSDK] Registering capability: ${reg.key} (Tier ${reg.trustTier})`);
    
    const { error } = await supabase
      .from("agent_capabilities")
      .upsert({
        capability_key: reg.key,
        display_name: reg.displayName,
        description: reg.description,
        runtime_type: reg.runtimeType,
        trust_tier: reg.trustTier
      }, { onConflict: 'capability_key' });

    if (error) throw error;
  }

  /**
   * Registers and installs a vertical pack.
   */
  static async registerPack(reg: PackRegistration) {
    // Map to VerticalPackManifest interface
    return await PackRegistryService.registerPack({
        packId: reg.slug,
        name: reg.name,
        description: reg.manifest.description || "",
        category: reg.manifest.category || "general",
        workflows: reg.manifest.workflows || [],
        requiredCapabilities: reg.capabilityKeys,
        configurationSchema: reg.manifest.configurationSchema || {},
        pricing: reg.manifest.pricing || { monthlySubscriptionUsd: 0, costPerRunUsd: 0 }
    });
  }
}
