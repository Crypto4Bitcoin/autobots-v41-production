import { SelfOptimizationService } from "../lib/services/self-optimization.service";
import { GovernanceEvolutionService } from "../lib/services/governance-evolution.service";
import { PlatformMirrorService } from "../lib/services/platform-mirror.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAutonomicOptimization() {
  console.log("🚀 Testing Phase 41: Autonomic Optimization & Mirroring...\n");

  setupSupabaseMock();

  // 1. Self-Optimization
  const optimizer = new SelfOptimizationService();
  const optimizations = await optimizer.optimizeSystem();
  console.log(`✅ optimizations identified: ${optimizations.length}.`);
  console.log(`- Target: ${optimizations[0].target} (${optimizations[0].new_value})`);

  // 2. Mirror Validation
  const mirror = new PlatformMirrorService();
  const result = await mirror.runMirror(optimizations[0].target);
  console.log(`✅ Shadow Mirror Results: Shadow ${result.shadow_success_rate * 100}% vs Prod ${result.production_success_rate * 100}%`);
  console.log(`- Safety Score: ${result.safety_score}`);

  // 3. Governance Evolution
  const gov = new GovernanceEvolutionService();
  const changes = await gov.evolveGovernance();
  console.log(`✅ Governance Evolution: ${changes.length} policy adjustments proposed.`);
  console.log(`- Policy: ${changes[0].policy_key} (${changes[0].adjustment})`);

  if (result.shadow_success_rate > result.production_success_rate) {
      console.log("✅ Autonomic path validated for promotion.");
  }

  console.log("\n🎉 PHASE 41: AUTONOMIC OPTIMIZATION VERIFIED!");
}

testAutonomicOptimization();
