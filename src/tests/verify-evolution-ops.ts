import { AgentPerformanceProfiler } from '../lib/evolution/agent-performance-profiler';
import { AgentEvolutionService } from '../lib/evolution/agent-evolution.service';
import { EcosystemSandboxService } from '../lib/evolution/ecosystem-sandbox.service';
import { AgentRetirementService } from '../lib/evolution/agent-retirement.service';
import { EvolutionApprovalService } from '../lib/evolution/evolution-approval.service';

async function runTests() {
  console.log("--- Starting Phase 78 Ecosystem Evolution Verification ---");

  const workspaceId = 'workspace_epsilon';

  // 1. Test Performance Profiling
  console.log("\n[Test 1] Verifying Agent Performance Profiling");
  const underperformers = AgentPerformanceProfiler.identifyUnderperformers();
  console.log(`Underperforming Roles: ${underperformers.map(u => u.role).join(', ')}`);
  console.assert(underperformers.some(u => u.role === 'Analysis'), "Analysis should be identified as underperformer!");

  // 2. Test Evolution Recommendation
  console.log("\n[Test 2] Verifying Evolution Recommendation");
  const recommendation = await AgentEvolutionService.recommendEvolution(workspaceId);
  console.log(`Recommendation Type: ${recommendation.type} | Targets: ${recommendation.targets.join(', ')}`);
  console.assert(recommendation.type === 'Refinement', "Should recommend refinement!");

  // 3. Test Sandbox Simulation
  console.log("\n[Test 3] Verifying Ecosystem Sandbox Simulation");
  const simulationResult = await EcosystemSandboxService.simulateChange(recommendation);
  console.log(`Simulation Result: ${simulationResult ? 'PASSED' : 'FAILED'}`);
  console.assert(simulationResult === true, "Sandbox simulation should pass!");

  // 4. Test Evolution Approval & Execution
  console.log("\n[Test 4] Verifying Evolution Approval & Retirement");
  const isApproved = await EvolutionApprovalService.requestApproval(recommendation);
  if (isApproved) {
      for (const role of recommendation.targets) {
          await AgentRetirementService.retireAgent(role);
      }
  }
  console.log(`Evolution Execution: ${isApproved ? 'Success' : 'Blocked'}`);

  console.log("\n--- Ecosystem Evolution Verification Complete ---");
}

runTests().catch(console.error);
