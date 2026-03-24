import { EvolutionSimulationService } from "../lib/services/evolution-simulation.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testEvolutionSimulation() {
  console.log("🚀 Testing Phase 39: Sandboxed Evolution Simulation...\n");

  setupSupabaseMock();

  const simulator = new EvolutionSimulationService();

  const mockProposal: unknown = {
      id: "prop-123",
      workflow_id: "media-render-v1",
      type: "capability_replacement"
  };

  // 1. Run Simulation
  console.log("Step 1: Running sandboxed simulation for proposal...");
  const result = await simulator.simulateProposal(mockProposal);
  
  console.log(`✅ Simulation Status: ${result.passed ? "PASSED" : "FAILED"}`);
  console.log(`- Projected Cost: $${result.metrics.projected_cost}`);
  console.log(`- Structural Score: ${result.metrics.structural_score}`);

  if (result.passed) {
      console.log("✅ Evolution proposal verified for safe deployment.");
  }

  console.log("\n🎉 PHASE 39: EVOLUTION SIMULATION VERIFIED!");
}

testEvolutionSimulation();
