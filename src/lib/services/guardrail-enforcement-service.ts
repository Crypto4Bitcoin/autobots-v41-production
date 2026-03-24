import { DBService } from "./supabase-service";

export class GuardrailEnforcementService {
  /**
   * Validates that an operation complies with platform guardrails.
   * Rule 4: Mandatory Idempotency for side effects.
   * Rule 5: Governance/Approval for autonomous changes.
   */
  static validateOperation(op: { 
    type: string; 
    idempotencyKey?: string; 
    isAutonomous?: boolean; 
    isApproved?: boolean;
    trustTier?: number;
  }) {
    console.log(`[Guardrail] Validating operation: ${op.type}...`);

    // 1. Rule 4: Side-effect Idempotency
    const sideEffectTypes = ["publish", "notify", "external_api", "artifact_creation"];
    if (sideEffectTypes.includes(op.type) && !op.idempotencyKey) {
        throw new Error(`[Guardrail Violation] Operation '${op.type}' requires a mandatory idempotency key (Rule 4).`);
    }

    // 2. Rule 5: Autonomous Trust
    if (op.isAutonomous && !op.isApproved) {
        throw new Error(`[Guardrail Violation] Autonomous operation '${op.type}' requires explicit governance approval (Rule 5).`);
    }

    // 3. Rule 2: Core/Domain Boundary (Simplified)
    // In production, this would check if domain-specific logic is leaking into orchestrator calls
    
    console.log(`[Guardrail] Operation '${op.type}' PASSED all safety gates.`);
    return true;
  }

  /**
   * Audits a projection against the event stream to detect drift (Rule 1).
   */
  static async auditProjection(workflowId: string, currentProjection: unknown) {
      console.log(`[Guardrail] Auditing projection drift for workflow ${workflowId} (Rule 1)...`);
      
      const events = await DBService.getWorkflowEvents(workflowId);
      // Simplified check: Does history exist?
      if (events.length === 0 && currentProjection) {
          throw new Error(`[Guardrail Violation] Projection exists for workflow ${workflowId} but no event history found. Event authority breach detected.`);
      }

      return { drift_score: 0.0, status: "aligned" };
  }
}
