import { SystemicRiskModeler } from '../lib/risk/systemic-risk-modeler';
import { CascadeFailurePredictor } from '../lib/risk/cascade-failure-predictor';
import { GeopoliticalDisruptionModeler } from '../lib/risk/geopolitical-disruption.modeler';
import { CrisisResponsePlaybooks } from '../lib/risk/crisis-response-playbooks';

async function runTests() {
  console.log("--- Starting Phase 85 Risk & Stability Verification ---");

  // 1. Test Systemic Risk Modeling
  console.log("\n[Test 1] Verifying Systemic Risk Modeling");
  const riskResult = await SystemicRiskModeler.evaluateGlobalStability();
  console.log(`Stability Score: ${riskResult.stabilityScore} | Vectors: ${riskResult.majorRiskVectors.join(', ')}`);
  console.assert(riskResult.stabilityScore > 0.9, "Global stability too low!");

  // 2. Test Cascade Failure Prediction
  console.log("\n[Test 2] Verifying Cascade Failure Prediction");
  const cascadePoints = CascadeFailurePredictor.detectCascadePoints();
  console.log(`Detected Points: ${cascadePoints.length}`);
  console.assert(cascadePoints.length > 0, "No cascade points detected!");

  // 3. Test Geopolitical Disruption Modeling
  console.log("\n[Test 3] Verifying Geopolitical Disruption Modeling");
  const geoResult = await GeopoliticalDisruptionModeler.modelDisruption('eu-central');
  console.log(`Prob: ${geoResult.probability} | Cause: ${geoResult.primaryCause} | Severity: ${geoResult.severity}`);

  // 4. Test Crisis Response Playbook Generation
  console.log("\n[Test 4] Verifying Crisis Response Playbook");
  const playbook = await CrisisResponsePlaybooks.generateCrisisPlaybook('Regional_Outage_Recovery');
  console.log(`Playbook Steps: ${playbook.steps.join(' -> ')}`);
  console.assert(playbook.steps.length >= 3, "Playbook should have at least 3 steps!");

  console.log("\n--- Risk & Stability Verification Complete ---");
}

runTests().catch(console.error);
