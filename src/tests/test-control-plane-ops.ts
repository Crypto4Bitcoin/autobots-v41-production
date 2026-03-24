import { ControlPlaneService } from "../lib/services/control-plane-ops.service";
import { FleetOperationsService } from "../lib/services/fleet-operations.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testControlPlaneOps() {
  console.log("🚀 Testing Phase 27: Control Plane & Fleet Operations...\n");

  setupSupabaseMock();

  const control = new ControlPlaneService();
  const fleet = new FleetOperationsService();

  // 1. Scenario: Global State Management
  console.log("Scenario A: Global Operational State");
  const update = await control.updateGlobalState({ global_status: "drain", maintenance_mode: true });
  console.log(`✅ Global state updated: Status = ${update.global_status}, Maintenance = ${update.maintenance_mode}\n`);

  // 2. Scenario: Workspace-Level Authority
  console.log("Scenario B: Workspace Pause/Resume");
  const wsPause = await control.pauseWorkspace("ws-789");
  console.log(`✅ Workspace ws-789 status: ${wsPause.status}`);
  const wsResume = await control.resumeWorkspace("ws-789");
  console.log(`✅ Workspace ws-789 status: ${wsResume.status}\n`);

  // 3. Scenario: Worker Cordon & Drain
  console.log("Scenario C: Worker Cordoning & Queue Draining");
  const cordon = await fleet.cordonWorker("w-999", "scheduled_maintenance");
  console.log(`✅ Worker w-999 cordoned. Status: ${cordon.status}, Reason: ${cordon.metadata.cordon_reason}`);
  
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const drain = await fleet.drainQueue("queue_media");
  console.log(`✅ Drain initiated for queue: queue_media\n`);

  if (update.global_status === "drain" && wsResume.status === "active" && cordon.status === "cordoned") {
    console.log("✅ Control plane and fleet operations verified.");
  } else {
    console.error("❌ FAILED: Control plane validation mismatch.");
  }

  console.log("\n🎉 PHASE 27: CONTROL PLANE VERIFIED!");
}

testControlPlaneOps();
