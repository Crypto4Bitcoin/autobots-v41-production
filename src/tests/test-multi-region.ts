import { 
  RegionHealthMonitor, 
  RegionRoutingService, 
  CrossRegionFailoverService, 
  TraceContinuityService, 
  MultiRegionStateService,
  EdgeWorkerService
} from "../lib/services/multi-region-service";

async function runPhase47Tests() {
  console.log("?? Testing Phase 47: Multi-Region Planetary Runtime\n");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const runId = "run-global-001";
  const workspaceId = "ws-101";
  const workflowId = "wf-planet-1";

  RegionHealthMonitor.setHealth("us-east", true);
  RegionHealthMonitor.setHealth("us-west", true);
  RegionHealthMonitor.setHealth("eu-central", true);
  RegionHealthMonitor.setHealth("ap-southeast", true);

  // 1. Route workflow to preferred region when affinity is specified
  console.log("Test 1: Route workflow to preferred region when affinity is specified...");
  const region1 = RegionRoutingService.routeWorkflow(workspaceId, workflowId, "eu-central");
  if (region1 === "eu-central") console.log("? Passed: Routed to eu-central.");
  else console.error("? Failed.");

  // 2. Route workflow to nearest healthy region when affinity is not specified
  console.log("\nTest 2: Route workflow to nearest healthy region when affinity is not specified...");
  RegionHealthMonitor.setHealth("us-east", false); // simulate outage
  const region2 = RegionRoutingService.routeWorkflow(workspaceId, workflowId);
  if (region2 === "us-west") console.log("? Passed: Bypassed failed us-east and routed to us-west.");
  else console.error("? Failed. Routed to: " + region2);

  RegionHealthMonitor.setHealth("us-east", true);

  // 3. Fail over execution when a region becomes unavailable
  console.log("\nTest 3: Fail over execution when a region becomes unavailable...");
  const failoverRun = "run-failover-001";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  let attempts = 0;
  
  try {
     const result = await CrossRegionFailoverService.executeWithFailover(
       failoverRun, workspaceId, workflowId, "us-east",
       async (region) => {
         attempts++;
         if (region === "us-east") {
            console.log("   -> [us-east] Executing step 1...");
            throw new Error("REGION_FAILURE"); // Simulating abrupt failure
         }
         console.log(`   -> [${region}] Executing resuming from step 1...`);
         return { success: true, processedBy: region };
       }
     );
     console.log("? Passed: Failover execution successful. Recovered by:", result.processedBy);
  } catch(e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 4. Preserve workflow state consistency across replicated regions
  console.log("\nTest 4: Preserve workflow state consistency across replicated regions...");
  const replicaState = MultiRegionStateService.getState("ap-southeast", failoverRun);
  if (replicaState && replicaState.status === "completed") {
     console.log("? Passed: Final execution state replicated successfully to ap-southeast.");
  } else {
     console.error("? Failed.");
  }

  // 5. Preserve trace continuity across region handoff and failover
  console.log("\nTest 5: Preserve trace continuity across region handoff and failover...");
  const traces = TraceContinuityService.getTraceStream(failoverRun);
  console.log(`   -> Traces found: ${traces.length}`);
  const hasEast = traces.find(t => t.region === "us-east");
  const hasWest = traces.find(t => t.region === "us-west" || t.region === "eu-central"); // nearest healthy was selected
  if (hasEast && hasWest) {
     console.log("? Passed: Traces show continuous execution story across region boundary.");
  } else {
     console.error("? Failed.");
  }

  // Reset health for split brain test
  RegionHealthMonitor.setHealth("us-east", true);

  // 6. Prevent duplicate execution during cross-region failover recovery
  console.log("\nTest 6: Prevent duplicate execution during cross-region failover recovery (Split-Brain)...");
  try {
     // Trigger parallel failover to simulate network partition where two nodes try to failover the same run
     const p1 = CrossRegionFailoverService.executeWithFailover(
       "run-split-001", workspaceId, workflowId, "us-east",
       async (r) => { if (r === "us-east") throw new Error("REGION_FAILURE"); return { success: true }; }
     );
     const p2 = CrossRegionFailoverService.executeWithFailover(
       "run-split-001", workspaceId, workflowId, "us-east",
       async (r) => { if (r === "us-east") throw new Error("REGION_FAILURE"); return { success: true }; }
     );
     await Promise.all([p1, p2]);
     console.error("? Failed: Did not detect split brain.");
  } catch (e: unknown) {
     if (e.message.includes("Duplicate Execution Prevented")) {
       console.log("? Passed: Split-brain prevented via failover lock - " + e.message);
     } else {
       console.log("? Failed with wrong error: " + e.message);
     }
  }

  // 7. Validate edge worker selection for latency-sensitive workloads
  console.log("\nTest 7: Validate edge worker selection for latency-sensitive workloads...");
  const worker = EdgeWorkerService.selectWorker("ap-southeast", "low-latency-inference");
  if (worker.includes("ap-southeast")) {
    console.log(`? Passed: Selected edge worker in optimal location: ${worker}`);
  } else {
    console.error("? Failed.");
  }

  console.log("\n?? PHASE 47: PLANETARY RUNTIME COMPLETED!");
}

runPhase47Tests();
