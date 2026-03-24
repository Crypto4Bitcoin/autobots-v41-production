import { DBService } from "./supabase-service";

export interface PolicyBundle {
  id: string;
  workspace_id: string;
  workflow_id: string | null;
  autonomy_mode: string;
  trust_resolution: string;
  budget_caps: number;
  allowed_providers: string[];
  review_requirements: string[];
  reason_codes: string[];
  compiled_at: string;
  compiler_version: string;
}

export class PolicyCompilerService {
  private readonly COMPILER_VERSION = "1.0.0";

  /**
   * Compiles governance inputs into a persisted, immutable policy bundle.
   */
  async compileAndPersist(context: {
    workspaceId: string;
    trustTier: number;
    autonomyLevel: string;
    budgetLimit: number;
    workflowId?: string;
  }): Promise<PolicyBundle> {
    console.log(`[PolicyCompiler] Compiling persisted bundle for workspace ${context.workspaceId}...`);

    const bundleId = `pb-${Math.random().toString(36).substring(2, 9)}`;
    
    const bundle: PolicyBundle = {
      id: bundleId,
      workspace_id: context.workspaceId,
      workflow_id: context.workflowId || null,
      autonomy_mode: context.autonomyLevel,
      trust_resolution: context.trustTier >= 3 ? "restricted" : "full",
      budget_caps: context.budgetLimit,
      allowed_providers: ["gemini", "ollama"],
      review_requirements: context.trustTier >= 3 ? ["manual_approval"] : [],
      reason_codes: context.trustTier >= 3 ? ["tier3_governance_trigger"] : [],
      compiled_at: new Date().toISOString(),
      compiler_version: this.COMPILER_VERSION
    };

    // Rule: Persist before use
    const result = await DBService.upsertPolicyBundle(bundle);
    console.log(`[PolicyCompiler] Compiled and persisted bundle: ${result.id}`);

    return result;
  }

  /**
   * Resolves a persisted policy bundle by ID.
   */
  async getBundle(bundleId: string): Promise<PolicyBundle> {
    const bundle = await DBService.getPolicyBundle(bundleId);
    if (!bundle) {
        throw new Error(`[Policy Resolution] Failed to find compiled policy bundle: ${bundleId}`);
    }
    return bundle;
  }
}
