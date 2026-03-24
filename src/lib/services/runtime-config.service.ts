import { supabase } from "./supabase-service";

export interface RuntimeConfig {
  id: string;
  version: string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: Record<string, any>;
  active_from: string;
}

export class RuntimeConfigService {
  private readonly CURRENT_VERSION = "2.1.0";

  /**
   * Retrieves the active runtime configuration for a worker.
   */
  async getActiveConfig(): Promise<RuntimeConfig> {
    console.log(`[RuntimeConfig] Fetching active configuration (Version: ${this.CURRENT_VERSION})...`);

    const { data, error } = await supabase
      .from("runtime_configs")
      .select("*")
      .eq("version", this.CURRENT_VERSION)
      .single();

    if (error || !data) {
        // Fallback to embedded defaults if DB is unreachable
        return {
            id: "default",
            version: this.CURRENT_VERSION,
            values: { 
                log_level: "info", 
                max_concurrency: 50,
                backpressure_threshold: 0.8
            },
            active_from: new Date().toISOString()
        };
    }

    return data;
  }

  /**
   * Deploys a new versioned configuration bundle.
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deployConfig(version: string, values: Record<string, any>) {
    console.log(`[RuntimeConfig] Deploying new configuration version v${version}...`);
    await supabase.from("runtime_configs").insert([{
      version,
      values,
      active_from: new Date().toISOString()
    }]);
  }
}
