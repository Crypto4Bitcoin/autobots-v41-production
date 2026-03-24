import { InterGovCoordinationProtocol } from '../lib/coordination/inter-gov-coordination.protocol';
import { CrisisStandardSet } from '../lib/coordination/crisis-standard-set';
import { StrategicCollaborationFabric } from '../lib/coordination/strategic-collaboration-fabric';
import { AlignmentBaseline } from '../lib/coordination/alignment-baseline';

async function runTests() {
  console.log("--- Starting Phase 97 Coordination Verification ---");

  // 1. Test Alignment Baseline
  console.log("\n[Test 1] Verifying Alignment Baseline");
  const baseline = AlignmentBaseline.getBaseline();
  console.log(`Global Consensus: ${baseline.globalConsensus} | Latency: ${baseline.coordinationLatency}`);
  console.assert(baseline.globalConsensus > 0.9, "Alignment consensus too low!");

  // 2. Test Inter-Gov Coordination
  console.log("\n[Test 2] Verifying Inter-Gov Coordination Protocol");
  const alignment = await InterGovCoordinationProtocol.alignEntities('Region_East', 'Region_West', 'Resource_Equity');
  console.log(`Alignment Status: ${alignment.status} | ID: ${alignment.alignmentId}`);
  console.assert(alignment.status === 'Consensus_Achieved', "Consensus failure!");

  // 3. Test Crisis Standard Set
  console.log("\n[Test 3] Verifying Crisis Standard Set");
  const crisis = await CrisisStandardSet.activateStandard('Systemic_Instability');
  console.log(`Standard ID: ${crisis.standardId} | Mitigation: ${crisis.projectedMitigation}`);
  console.assert(crisis.complianceRequired === true, "Crisis standard activation failed!");

  // 4. Test Strategic Fabric
  console.log("\n[Test 4] Verifying Strategic Collaboration Fabric");
  const fabric = await StrategicCollaborationFabric.establishFabric();
  console.log(`Fabric Status: ${fabric.fabricStatus} | Encryption: ${fabric.encryption}`);
  console.assert(fabric.fabricStatus === 'Active', "Fabric deployment failed!");

  console.log("\n--- Coordination Verification Complete ---");
}

runTests().catch(console.error);
