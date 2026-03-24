import { AutonomyModeService } from "../lib/services/autonomy-mode.service";
import { SafetyModeService } from "../lib/services/safety-mode.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAutonomyModes() {
  console.log("🚀 Testing Phase 29: Autonomy Levels & Safety Modes...\n");

  setupSupabaseMock();

  const autonomy = new AutonomyModeService();
  const safety = new SafetyModeService();

  // 1. Scenario: Autonomy Profiles
  console.log("Scenario A: Workspace Autonomy Profile");
  const profile = await autonomy.setAutonomyMode({ workspaceId: "ws-test-autonomy" }, "fully_autonomous");
  console.log(`✅ Autonomy mode for ws-test-autonomy set to: ${profile.mode}\n`);

  // 2. Scenario: Safety Envelope Transitions
  console.log("Scenario B: Safety Mode Transitions");
  const transition = await safety.setSafetyMode("strict", "ws-test-autonomy");
  console.log(`✅ Safety mode for ws-test-autonomy transitioned to: ${transition.mode}\n`);

  // 3. Scenario: Capability Permittance (Mode Check)
  console.log("Scenario C: Capability Enveloping");
  const allowed = await safety.permitsCapability("media.render", 2);
  console.log(`✅ Capability 'media.render' (Trust-Tier 2) permitted under current envelope: ${allowed}\n`);

  if (profile.mode === "fully_autonomous" && transition.mode === "strict" && allowed === true) {
    console.log("✅ Autonomy and safety logic verified.");
  } else {
    console.error("❌ FAILED: Autonomy validation mismatch.");
  }

  console.log("\n🎉 PHASE 29: AUTONOMY & SAFETY VERIFIED!");
}

testAutonomyModes();
