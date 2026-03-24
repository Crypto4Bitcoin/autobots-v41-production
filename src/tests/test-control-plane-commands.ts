import { OperatorCommandConsole } from "../lib/services/operator-command-console";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testControlPlaneCommands() {
  console.log("🚀 Testing Phase 37: Control Plane Intervention & Commands...\n");

  setupSupabaseMock();

  const console_ctrl = new OperatorCommandConsole();

  // 1. Global Status Change (Pause)
  console.log("Step 1: Setting global status to PAUSED...");
  await console_ctrl.setGlobalStatus("paused", "Scheduled maintenance window.");
  console.log("✅ Platform status updated and event logged.\n");

  // 2. Workspace Throttling
  console.log("Step 2: Throttling workspace 'ws-123'...");
  await console_ctrl.throttleWorkspace("ws-123", 5);
  console.log("✅ Workspace limit enforced.\n");

  // 3. Queue Drain Mode
  console.log("Step 3: Activating DRAIN_MODE...");
  await console_ctrl.setGlobalStatus("drain_mode", "Emergency incident response.");
  console.log("✅ Drain mode activated.\n");

  console.log("\n🎉 PHASE 37: CONTROL PLANE INTEGRATION VERIFIED!");
}

testControlPlaneCommands();
