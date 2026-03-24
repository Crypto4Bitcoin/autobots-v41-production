import { MarketplacePublisherService } from "../lib/services/agent-package-verifier";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MarketplaceInstallerService } from "../lib/services/marketplace-installer-service";
import { SandboxRuntimeService } from "../lib/services/sandbox-runtime-service";
import { AgentPackageManifest, MarketplaceMetadataService } from "../lib/services/marketplace-metadata-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function runPhase44Tests() {
  console.log("?? Testing Phase 44: Marketplace Runtime (Hardening Checks)\n");

  setupSupabaseMock();

  const mockManifest: AgentPackageManifest = {
    id: "pkg-crypto-bot-1",
    name: "Crypto Trading Bot",
    version: "1.0.0",
    publisherId: "pub-123",
    description: "Executes generic crypto trades based on specified logic.",
    capabilities: [{ key: "crypto-trade", type: "external_agent" }],
    sandboxPolicy: {
      allowNetworkEgress: false,
      maxMemoryMb: 512,
      timeoutMs: 5000
    },
    pricingMetadata: {
      baseCostPerRun: 0.05
    }
  };

  MarketplaceMetadataService.getPackage = async (id: string) => {
    if (id === "pkg-crypto-bot-1") return mockManifest;
    return null;
  };

  // 1. Reject tampered package signature
  console.log("Test 1: Reject tampered package signature...");
  try {
    await MarketplacePublisherService.publish(mockManifest, "TAMPERED_SIG");
    console.error("? Failed: Accepted tampered signature.");
  } catch (e: unknown) {
    console.log("? Passed:", e.message);
  }

  // Publish properly for subsequent tests
  await MarketplacePublisherService.publish(mockManifest, "VALID_SIG");

  // 2. Block FileSystem Reads Outside Sandbox
  console.log("\nTest 2: Block unauthorized filesystem reads/writes outside sandbox...");
  try {
    await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { tryFsOutsideSandbox: true }
    );
    console.error("? Failed: Sandbox allowed FS egress.");
  } catch (e: unknown) {
    console.log("? Passed:", e.message);
  }

  // 3. Block Cross-Package Artifact Access
  console.log("\nTest 3: Verify package A cannot access package B runtime artifacts...");
  try {
    await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { tryAccessOtherPkg: "pkg-secure-vault-1" }
    );
    console.error("? Failed: Sandbox allowed cross-package memory/artifact access.");
  } catch (e: unknown) {
    console.log("? Passed:", e.message);
  }

  // 4. Block Cross-Tenant Workspace Exploits
  console.log("\nTest 4: Verify cross-tenant workspace isolation under marketplace execution...");
  try {
    await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { tryAccessOtherWorkspace: "ws-tenant-999-admin" }
    );
    console.error("? Failed: Platform allowed workspace-to-workspace tenant exploit.");
  } catch (e: unknown) {
    console.log("? Passed:", e.message);
  }

  // 5. Verify Duplicate Execution Billing
  console.log("\nTest 5: Verify duplicate execution does not double-bill...");
  try {
    const res1 = await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { idempotencyKey: "idem-abc-123" }
    );
    const res2 = await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { idempotencyKey: "idem-abc-123" }
    );
    if (res1.billed === true && res2.billed === false) {
       console.log("? Passed: Billed the first execution, successfully deduplicated and skipped billing second execution.");
    } else {
       console.error("? Failed: Did not accurately catch double-billing for duplicated idempotency keys.");
    }
  } catch (e: unknown) {
    console.error("? Failed:", e.message);
  }

  // 6. Verify Partial Failure Billing State
  console.log("\nTest 6: Verify failed execution emits correct non-billable state...");
  try {
    await SandboxRuntimeService.executeSandboxed(
        "ws-tenant-1", mockManifest, "crypto-trade", { amount: 100 }, 
        { simulateFailure: "partial" }
    );
    console.error("? Failed: Proceeded with execution and billed despite crash.");
  } catch (e: unknown) {
    console.log("? Passed:", e.message);
  }

  console.log("\n?? PHASE 44 HARDENING COMPLETE!");
}

runPhase44Tests();
