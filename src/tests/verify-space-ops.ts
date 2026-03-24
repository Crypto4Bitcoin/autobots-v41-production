import { SpaceNetworkProtocol } from '../lib/space/space-network.protocol';
import { DelayTolerantOrchestrator } from '../lib/space/delay-tolerant-orchestrator';
import { AsynchronousDecisionService } from '../lib/space/asynchronous-decision.service';
import { RegionalSovereigntyEngine } from '../lib/space/regional-sovereignty.engine';

async function runTests() {
  console.log("--- Starting Phase 90 Interplanetary Verification ---");

  // 1. Test Space Network Transmission
  console.log("\n[Test 1] Verifying Space Network Transmission");
  const marsTx = await SpaceNetworkProtocol.transmit('MARS_NODE_ALPHA', { cmd: 'Update_Baseline' });
  console.log(`Transmission Status: ${marsTx.status} | Expected Latency: ${marsTx.latency / 60000} minutes`);
  console.assert(marsTx.status === 'Queued', "Transmission failed to queue!");

  // 2. Test DTN Orchestration
  console.log("\n[Test 2] Verifying DTN Orchestration");
  const task = await DelayTolerantOrchestrator.scheduleInterplanetaryTask('task_992', 'EUROPA_01');
  console.log(`Task Status: ${task.taskStatus} | Next Sync: ${new Date(task.syncCheckPoint).toISOString()}`);
  console.assert(task.taskStatus === 'Asynchronous_Propagation', "Orchestration failed!");

  // 3. Test Async Decision Propagation
  console.log("\n[Test 3] Verifying Async Decision Propagation");
  const propagation = await AsynchronousDecisionService.propagateDecision({ baseline: '89.4.2' });
  console.log(`Reach: ${propagation.propagationReach} | Reconciled Nodes: ${propagation.reconciledNodes}`);
  console.assert(propagation.reconciledNodes > 0, "No nodes reconciled!");

  // 4. Test Regional Sovereignty
  console.log("\n[Test 4] Verifying Regional Sovereignty");
  const mode = await RegionalSovereigntyEngine.activateAutonomousMode('EUROPA_01');
  console.log(`Sovereignty Status: ${mode.localAuditActive ? 'ACTIVE' : 'INACTIVE'} | Cache: ${mode.policyCacheVersion}`);
  console.assert(mode.localAuditActive === true, "Sovereignty failed to activate!");

  console.log("\n--- Interplanetary Verification Complete ---");
}

runTests().catch(console.error);
