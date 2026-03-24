import { supabase } from "./supabase-service";
import { CapabilityValidatorService, CapabilityContract } from "./capability-validator-service";

export interface Capability {
  key: string;
  name: string;
  type: "internal_agent" | "tool_adapter" | "api_action" | "human_task" | "external_agent";
  inputSchema?: unknown;
  outputSchema?: unknown;
}

export class CapabilityRegistryService {
  /**
   * Registers a new capability, enforcing the canonical contract.
   */
  static async registerCapability(contractData: unknown): Promise<{ success: boolean; version: number }> {
    // 1. Phase 43 Validation Enforcement
    const validatedContract = CapabilityValidatorService.validate(contractData);
    
    // 2. Backward Compatibility Check
    const existing = await this.getCapabilityContract(validatedContract.key);
    if (existing) {
        if (!CapabilityValidatorService.isBackwardCompatible(existing, validatedContract)) {
           throw new Error("Incompatible capability upgrade for . Breaking schema drifts are not permitted.");
        }
    }

    // 3. Persist Contract
    const { data, error } = await supabase.from("agent_capabilities").upsert({
        capability_key: validatedContract.key,
        display_name: validatedContract.displayName,
        description: validatedContract.description,
        runtime_type: validatedContract.runtimeType,
        trust_tier: validatedContract.trustTier,
        input_schema: validatedContract.inputSchema,
        output_schema: validatedContract.outputSchema,
        cost_profile: validatedContract.costProfile,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        version: existing ? (existing as any).version + 1 : 1,
        is_enabled: true
    }, { onConflict: "capability_key" }).select().single();

    if (error) throw error;
    
    return { success: true, version: data.version };
  }

  /**
   * Fetches the raw capability contract.
   */
  static async getCapabilityContract(key: string): Promise<CapabilityContract | null> {
    const { data, error } = await supabase
      .from("agent_capabilities")
      .select("*")
      .eq("capability_key", key)
      .eq("is_enabled", true)
      .maybeSingle();

    if (error || !data) return null;

    return {
      key: data.capability_key,
      displayName: data.display_name,
      description: data.description,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      runtimeType: data.runtime_type as any,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      trustTier: data.trust_tier as any,
      inputSchema: data.input_schema,
      outputSchema: data.output_schema,
      costProfile: data.cost_profile || {},
      timeoutMs: data.timeout_ms,
      executionMode: data.execution_mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  /**
   * Fetches a capability definition for execution routing.
   */
  static async getCapability(key: string): Promise<Capability | null> {
    const contract = await this.getCapabilityContract(key);
    if (!contract) return null;

    return {
      key: contract.key,
      name: contract.displayName,
      type: contract.runtimeType,
      inputSchema: contract.inputSchema,
      outputSchema: contract.outputSchema
    };
  }

  /**
   * Resolves the runtime executor (agent name or tool adapter) for a node.
   */
  static async resolveExecutor(node: unknown): Promise<{ name: string; type: string } | null> {
    const cap = await this.getCapability(node.capability_key || node.node_key);
    if (!cap) return null;

    return {
      name: node.agent_name || cap.key,
      type: cap.type
    };
  }

  /**
   * Records performance metrics for a capability run.
   */
  static async recordMetric(workspaceId: string, key: string, metrics: { latency: number; success: boolean; cost?: number }) {
    await supabase.from("capability_metrics").upsert({
      workspace_id: workspaceId,
      capability_key: key,
      last_run_at: new Date().toISOString(),
      avg_latency_ms: metrics.latency,
      success_rate: metrics.success ? 1 : 0
    }, { onConflict: "workspace_id, capability_key" });
  }
}
