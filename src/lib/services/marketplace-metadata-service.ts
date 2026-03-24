import { supabase } from "./supabase-service";

export interface AgentPackageManifest {
  id: string;
  name: string;
  version: string;
  publisherId: string;
  description: string;
  capabilities: unknown[];
  sandboxPolicy: {
    allowNetworkEgress: boolean;
    allowedDomains?: string[];
    maxMemoryMb: number;
    timeoutMs: number;
  };
  pricingMetadata: {
    baseCostPerRun: number;
  };
  verification?: {
    isVerified: boolean;
    verifiedAt: string;
  };
}

export class MarketplaceMetadataService {
  static async getPackage(packageId: string): Promise<AgentPackageManifest | null> {
    const { data, error } = await supabase
      .from("marketplace_packages")
      .select("*")
      .eq("id", packageId)
      .single();

    if (error) return null;
    return data;
  }

  static async registerPackage(manifest: AgentPackageManifest): Promise<void> {
    const { error } = await supabase
      .from("marketplace_packages")
      .upsert([manifest]);
    if (error) throw error;
  }
}

export const AgentPackageManifest = {} as any;
