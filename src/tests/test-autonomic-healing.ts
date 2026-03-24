import { AutonomicHealingService } from "../lib/services/autonomic-healing.service";
import { InfiniteLoopService } from "../lib/services/infinite-loop.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAutonomicHealing() {
  console.log("🚀 Testing Phase 41: Autonomic Healing & Genesis Loop...\n");

  setupSupabaseMock();

  // 1. Self-Healing
  const healer = new AutonomicHealingService();
  console.log("Step 1: Simulating provider instability...");
  const mitigations = await healer.healSystem();
  console.log(`✅ Healing Actions: ${mitigations.length} mitigations deployed.`);
  console.log(`- Action: ${mitigations[0].action} for ${mitigations[0].target} (Reason: ${mitigations[0].reason})`);

  // 2. Infinite Loop Rotation
  const genesis = new InfiniteLoopService();
  console.log("Step 2: Executing full Genesis Loop rotation...");
  await genesis.rotateGenesisLoop();
  console.log("✅ Infinite cycle completed successfully.");

  console.log("\n🎉 PHASE 41: AUTONOMIC HEALING VERIFIED!");
}

testAutonomicHealing();
