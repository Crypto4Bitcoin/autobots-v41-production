import { AlgorithmicAuditing } from '../lib/governance/algorithmic-auditing';
import { DisputeArbitrationEngine } from '../lib/governance/dispute-arbitration.engine';
import { ConstitutionalConstraintService } from '../lib/governance/constitutional-constraint.service';
import { GovernanceRules } from '../lib/governance/governance-rules';

async function runTests() {
  console.log("--- Starting Phase 88 Governance Protocol Verification ---");

  // 1. Test Algorithmic Auditing
  console.log("\n[Test 1] Verifying Algorithmic Auditing");
  const auditResult = await AlgorithmicAuditing.auditDecision('decision_8x92');
  console.log(`Audit Status: ${auditResult.status} | Proof: ${auditResult.proof} | Compliance: ${auditResult.compliance}`);
  console.assert(auditResult.status === 'Verified', "Audit failed!");

  // 2. Test Dispute Arbitration
  console.log("\n[Test 2] Verifying Dispute Arbitration");
  const arbitration = await DisputeArbitrationEngine.arbitrate('Corp_Alpha', 'Corp_Beta', { type: 'Resource_Contention' });
  console.log(`Resolution: ${arbitration.resolution} | Effect: ${arbitration.bindingEffect}`);
  console.assert(arbitration.bindingEffect === 'Planetary_Enforcement', "Arbitration binding effect failed!");

  // 3. Test Constitutional Constraint
  console.log("\n[Test 3] Verifying Constitutional Constraint");
  const isValid = ConstitutionalConstraintService.validateAction('action_992', 'Resource_Migration');
  console.log(`Constraint Validation: ${isValid ? 'PASSED' : 'FAILED'}`);
  console.assert(isValid === true, "Constitutional guard failed!");

  // 4. Test Governance Rules
  console.log("\n[Test 4] Verifying Governance Rules Retrieval");
  const protocols = GovernanceRules.getActiveProtocols();
  console.log(`Active Protocols: ${protocols.join(', ')}`);
  console.assert(protocols.length > 0, "No protocols retrieved!");

  console.log("\n--- Governance Protocol Verification Complete ---");
}

runTests().catch(console.error);
