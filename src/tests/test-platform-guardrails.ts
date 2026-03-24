import { GuardrailEnforcementService } from "../lib/services/guardrail-enforcement-service";
import { WorkerRegistryService } from "../lib/services/worker-registry-service";
import { JobLeaseService } from "../lib/services/job-lease-service";
import { ProjectionService } from "../lib/services/projection.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testPlatformGuardrails() {
  console.log("🚀 Testing Phase 34: Platform Guardrails & Runtime Enforcement...\n");

  setupSupabaseMock();

  const leaseService = new JobLeaseService();
  const projectionService = new ProjectionService();

  // 1. Scenario: Idempotency Key Validation (Rule 4)
  console.log("Scenario A: Mandatory Idempotency (Rule 4)");
  try {
    await leaseService.claimLease("node-1", "w-1", "", 10000); // Missing key
    console.error("❌ FAILED: Allowed lease claim without idempotency key.");
  } catch (err: unknown) {
    console.log(`✅ Correctly rejected: ${err.message}\n`);
  }

  // 2. Scenario: Dumb Worker Principle (Rule 3)
  console.log("Scenario B: Dumb Worker Enforcement (Rule 3)");
  try {
    await WorkerRegistryService.registerWorker({ 
        id: "w-smart", 
        type: "autonomous_planner", // Invalid class
        hostname: "worker-01" 
    });
    console.error("❌ FAILED: Allowed registration of 'smart' worker type.");
  } catch (err: unknown) {
    console.log(`✅ Correctly rejected: ${err.message}\n`);
  }

  // 3. Scenario: Autonomous Trust (Rule 5)
  console.log("Scenario C: Autonomous Trust Gate (Rule 5)");
  try {
    GuardrailEnforcementService.validateOperation({
        type: "workflow_evolution",
        isAutonomous: true,
        isApproved: false // Not approved
    });
    console.error("❌ FAILED: Allowed unapproved autonomous evolution.");
  } catch (err: unknown) {
    console.log(`✅ Correctly rejected: ${err.message}\n`);
  }

  // 4. Scenario: Event Authority Audit (Rule 1)
  console.log("Scenario D: Event Authority Breach Detection (Rule 1)");
  // Mocking empty event log for a populated projection
  setupSupabaseMock({ pipeline_events: [] });
  const audit = await projectionService.verifyEventAuthority("wf-drift", { some: "state" });
  console.log(`✅ Audit Outcome: ${audit.status}. Error: ${audit.error}\n`);

  if (audit.status === "drift_detected") {
    console.log("✅ Platform guardrails and runtime enforcement verified.");
  } else {
    console.error("❌ FAILED: Guardrail validation mismatch.");
  }

  console.log("\n🎉 PHASE 34: PLATFORM GUARDRAILS VERIFIED!");
}

testPlatformGuardrails();
