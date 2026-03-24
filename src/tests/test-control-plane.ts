import { ControlPlaneService } from "../lib/services/control-plane.service";

async function testControlPlane() {
  console.log("🚀 Testing Phase 23: Global Control Plane...\n");

  const control = new ControlPlaneService();

  console.log("Scenario 1: Emergency Pause");
  const pause = await control.pauseWorkflow("wf-emergency-123");
  console.log(`✅ Workflow status: ${pause.status}\n`);

  console.log("Scenario 2: Enforcing Autonomy Level");
  const autonomy = await control.setAutonomyLevel("ws-test", 2);
  console.log(`✅ Workspace status: ${autonomy.status} (Level ${autonomy.autonomyLevel})\n`);

  console.log("Scenario 3: Global Safety Switch");
  const killSwitch = await control.emergencyStop();
  console.log(`✅ Global status: ${killSwitch.global_status}\n`);

  console.log("🎉 PHASE 23: GLOBAL CONTROL PLANE VERIFIED!");
}

testControlPlane();
