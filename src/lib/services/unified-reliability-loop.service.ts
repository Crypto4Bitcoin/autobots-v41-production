import { FailureTaxonomyEngine } from "./failure-taxonomy.service";
import { RootCauseCorrelationEngine } from "./root-cause-correlation.service";
import { ReliabilityGovernorAgent } from "../agents/reliability-governor";
import { RepairSandboxService } from "./repair-sandbox.service";
import { TestOrchestratorService } from "./test-orchestrator.service";
import { RollbackService } from "./rollback.service";
import { PlaybookLibraryService } from "./playbook-library.service";

export class UnifiedReliabilityLoopService {
  static async processSignal(signal: unknown) {
    const startTime = Date.now();
    console.log(`[UnifiedLoop] Process START: ${signal.alert_id}`);

    // 1. Playbook Check (Optimization for Speed)
    const playbook = PlaybookLibraryService.getPlaybookForIncident(signal.error_key);
    if (playbook && playbook.approval_requirement === "automatic") {
      console.log(`[UnifiedLoop] [FAST-PATH] Found Playbook: ${playbook.playbook_id}. Bypassing Diagnosis.`);
      return await this.executeRepairPath(signal, playbook, true, startTime);
    }

    // 2. Classify (Standard Path)
    const classification = FailureTaxonomyEngine.classify(signal.error_key);
    
    // 3. Correlate
    const incident = RootCauseCorrelationEngine.correlate(signal);

    // 4. Diagnose & Plan
    const repairPlan = {
      plan_id: `PLAN-${incident.incident_id}`,
      type: classification.category,
      risk_level: classification.severity === "critical" ? "medium" : "low"
    };

    // 5. Govern Decision (Zero Human Involvement for non-Critical)
    const decision = await ReliabilityGovernorAgent.evaluateDecision(incident, repairPlan);
    console.log(`[UnifiedLoop] Governor Decision: ${decision}`);

    if (decision === "escalate") {
       console.log("[UnifiedLoop] Decision: ESCALATE to human operator.");
       return;
    }

    return await this.executeRepairPath(signal, repairPlan, false, startTime);
  }

  private static async executeRepairPath(signal: unknown, plan: unknown, isFastPath: boolean, startTime: Date | number) {
    // Normalize repairType across Playbook and RepairPlan
    const repairType = isFastPath ? plan.playbook_id : plan.type;

    // 5. Sandbox (Mandatory)
    const sandboxResult = await RepairSandboxService.runInSandbox(plan, signal.metadata || {});
    if (!sandboxResult.success) {
      console.log("[UnifiedLoop] Sandbox FAILED. Aborting repair.");
      return;
    }

    // 6. Execute Fix
    console.log("[UnifiedLoop] Executing PRODUCTION repair...");
    await RollbackService.backup(signal.alert_id, { status: "pre-repair" }); 

    // 7. Verify
    const verification = await TestOrchestratorService.verifyRepair(repairType || "unknown_fix", "primary_system");
    
    if (verification.passed) {
      const duration = Date.now() - (startTime as number);
      console.log(`[UnifiedLoop] Repair VERIFIED in ${duration}ms. Promoting to PERSISTENT Playbook.`);
      if (!isFastPath) {
        PlaybookLibraryService.addPlaybook({
          playbook_id: `PB-${plan.type}-${Date.now()}`,
          incident_pattern: signal.error_key,
          repair_steps: ["apply_validated_patch"],
          verification_steps: ["automated_test_pass"],
          rollback_strategy: "atomic_revert",
          approval_requirement: "automatic"
        });
      }
    } else {
      console.warn("[UnifiedLoop] Verification FAILED. Triggering ROLLBACK.");
      await RollbackService.restore(signal.alert_id);
    }
    console.log("[UnifiedLoop] Process COMPLETE.");
  }
}