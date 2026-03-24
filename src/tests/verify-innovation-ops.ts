import { ProductIdeaGenerator } from '../lib/innovation/product-idea-generator';
import { WorkflowInventionEngine } from '../lib/innovation/workflow-invention.engine';
import { RDSimulationLoop } from '../lib/innovation/rd-simulation.loop';
import { AlgorithmicImprovementService } from '../lib/innovation/algorithmic-improvement.service';

async function runTests() {
  console.log("--- Starting Phase 84 Autonomous Innovation Verification ---");

  const workspaceId = 'workspace_omega';

  // 1. Test Idea Generation
  console.log("\n[Test 1] Verifying Product Idea Generation");
  const ideas = await ProductIdeaGenerator.generateIdeas(workspaceId);
  console.log(`Generated Ideas: ${ideas.map(i => i.title).join(', ')}`);
  console.assert(ideas.length > 0, "No ideas generated!");

  // 2. Test Workflow Invention
  console.log("\n[Test 2] Verifying Workflow Invention");
  const workflow = await WorkflowInventionEngine.inventWorkflow('Logistics');
  console.log(`Invented Workflow: ${workflow.name} | Efficiency: ${workflow.efficiencyGain}`);
  console.assert(workflow.efficiencyGain.includes('+'), "Efficiency gain should be positive!");

  // 3. Test R&D Simulation
  console.log("\n[Test 3] Verifying R&D Simulation Loop");
  const simResult = await RDSimulationLoop.runSimulation(ideas[0].id);
  console.log(`Simulation Status: ${simResult.status} | Performance Index: ${simResult.performanceIndex}`);
  console.assert(simResult.status === 'Verified', "Simulation verification failed!");

  // 4. Test Algorithmic Improvement
  console.log("\n[Test 4] Verifying Algorithmic Improvement");
  const algoResult = await AlgorithmicImprovementService.optimizeCore('TaskPlanner');
  console.log(`Optimization Delta: ${algoResult.performanceDelta} | Lines Refactored: ${algoResult.linesRefactored}`);
  console.assert(algoResult.performanceDelta.includes('+'), "Optimization delta should be positive!");

  console.log("\n--- Autonomous Innovation Verification Complete ---");
}

runTests().catch(console.error);
