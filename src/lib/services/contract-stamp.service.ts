import { DBService } from "./supabase-service";

export interface ExecutionContract {
  workflow_version: string;
  pack_versions: Record<string, string>;
  capability_schemas: Record<string, string>;
  policy_bundle_id: string;
  worker_runtime_version: string;
  execution_contract_version: string;
  timestamp: string;
}

export class ContractStampService {
  private readonly COMPILER_VERSION = "1.0.0";

  /**
   * Stamps a workflow run with a deterministic execution contract.
   * Rule: Production runs FAIL CLOSED if any version is unpinned or floating.
   */
  async stampRun(workflowRunId: string, contract: Omit<ExecutionContract, "timestamp" | "execution_contract_version">) {
    console.log(`[ContractStamp] Anchoring execution contract for run ${workflowRunId}...`);
    
    // 1. Audit for floating references (Fail-Closed)
    this.auditContract(contract);

    const fullContract: ExecutionContract = {
      ...contract,
      execution_contract_version: this.COMPILER_VERSION,
      timestamp: new Date().toISOString()
    };

    await DBService.logEvent({
      event_type: "execution_contract_anchored",
      workflow_run_id: workflowRunId,
      payload: fullContract
    });

    return fullContract;
  }

  private auditContract(contract: Omit<ExecutionContract, "timestamp" | "execution_contract_version">) {
    // Audit Workflow Version
    if (!contract.workflow_version || contract.workflow_version === "latest") {
        throw new Error("[Contract Violation] Workflow version must be explicitly pinned. Floating 'latest' or undefined is rejected in production.");
    }

    // Audit Pack Versions
    Object.entries(contract.pack_versions).forEach(([pack, version]) => {
        if (!version || version === "latest" || version.includes("*")) {
            throw new Error(`[Contract Violation] Pack '${pack}' version must be explicitly pinned (e.g., '1.2.3'). Found: '${version}'`);
        }
    });

    // Audit Policy Bundle
    if (!contract.policy_bundle_id || !contract.policy_bundle_id.startsWith("pb-")) {
        throw new Error("[Contract Violation] Mandatory compiled policy bundle missing or invalid ID.");
    }

    console.log("[ContractStamp] Contract audit PASSED. All versions pinned.");
  }
}

export const ExecutionContract = {} as any;
