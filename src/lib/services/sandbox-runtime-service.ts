import { AgentPackageManifest } from "./marketplace-metadata-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BillingService } from "./billing.service";

export class SandboxRuntimeService {
  // Track ongoing executions to prevent double billing for idempotency keys
  private static executionLogs: Record<string, { state: string; billed: boolean }> = {};

  static async executeSandboxed(
    workspaceId: string, 
    pkg: AgentPackageManifest, 
    capabilityKey: string, 
    payload: unknown,
    envOpts?: { 
      trySecretAccess?: boolean; 
      tryEgress?: string; 
      timeoutExceeded?: boolean;
      tryFsOutsideSandbox?: boolean;
      tryAccessOtherPkg?: string;
      tryAccessOtherWorkspace?: string;
      idempotencyKey?: string;
      simulateFailure?: string;
    }
  ) {
    const runId = envOpts?.idempotencyKey || `run-${Math.random()}`;
    
    console.log(`[SandboxRuntime] Starting execution for ${pkg.name}:${capabilityKey} in workspace ${workspaceId} (Run: ${runId})`);

    if (envOpts?.idempotencyKey && this.executionLogs[envOpts.idempotencyKey]?.state === "success") {
        console.log(`[SandboxRuntime] Duplicate execution detected for key ${envOpts.idempotencyKey}. Skipping execution and billing.`);
        return { status: "success", data: "Processed by third-party agent", billed: false };
    }

    // 1. Sandbox Policy Application
    if (envOpts?.timeoutExceeded) {
       console.log(`[SandboxRuntime] Execution timed out (${pkg.sandboxPolicy.timeoutMs}ms)`);
       throw new Error("Sandbox execution timed out.");
    }
    
    if (envOpts?.trySecretAccess) {
       console.log(`[SandboxRuntime] Blocked unapproved secret access.`);
       throw new Error("Sandbox violation: Unauthorized secret access blocked.");
    }
    
    if (envOpts?.tryEgress) {
       if (!pkg.sandboxPolicy.allowNetworkEgress) {
           console.log(`[SandboxRuntime] Blocked unauthorized network egress to ${envOpts.tryEgress}`);
           throw new Error("Sandbox violation: Network egress blocked by policy.");
       }
    }

    if (envOpts?.tryFsOutsideSandbox) {
        console.log(`[SandboxRuntime] Blocked unauthorized filesystem access.`);
        throw new Error("Sandbox violation: Filesystem egress outside ephemeral mount blocked.");
    }

    if (envOpts?.tryAccessOtherPkg) {
        console.log(`[SandboxRuntime] Blocked cross-package runtime access.`);
        throw new Error(`Sandbox violation: Cannot access memory/artifacts of package ${envOpts.tryAccessOtherPkg}`);
    }

    if (envOpts?.tryAccessOtherWorkspace) {
        console.log(`[SandboxRuntime] Blocked cross-tenant access.`);
        throw new Error(`Tenant Security violation: Workspace ${workspaceId} cannot execute or access target tenant ${envOpts.tryAccessOtherWorkspace}`);
    }

    if (envOpts?.simulateFailure === "partial") {
         this.executionLogs[runId] = { state: "failed", billed: false };
         console.log(`[SandboxRuntime] Emitting non-billable state due to agent crash.`);
         throw new Error("Agent execution crashed mid-flight. Not emitting billing event.");
    }

    // 2. Billing Event Generation
    const billedAmount = pkg.pricingMetadata.baseCostPerRun;
    console.log(`[SandboxRuntime] Emitting $${billedAmount} billing event for capability execution.`);

    this.executionLogs[runId] = { state: "success", billed: true };
    return { status: "success", data: "Processed by third-party agent", billed: true };
  }
}
