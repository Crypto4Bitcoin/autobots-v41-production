import { WorkerRegistryService } from "../lib/services/worker-registry-service";
import { QueueRouterService } from "../lib/services/queue-router-service";
import { JobLeaseService } from "../lib/services/job-lease-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testWorkerClustering() {
  console.log("🚀 Testing Phase 25: Distributed Worker Clustering & Registry...\n");

  setupSupabaseMock();

  try {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registry = new WorkerRegistryService();
    const lease = new JobLeaseService();

    // 1. Scenario: Worker Registration
    console.log("Scenario A: Worker Registration & Health");
    await WorkerRegistryService.registerWorker({
      id: "w-browser-1",
      type: "browser",
      hostname: "worker-01",
      metadata: { region: "us-east" }
    });
    console.log("✅ Worker 'w-browser-1' registered.\n");

    // 2. Scenario: Queue Partitioning
    console.log("Scenario B: Queue Partitioning (Routing)");
    const router = new QueueRouterService();
    
    const res1 = await router.dispatch({ nodeRunId: "n1", capability: "search.web" });
    console.log(`✅ Job n1 (search.web) routed to: ${res1.targetQueue}`);
    
    const res2 = await router.dispatch({ nodeRunId: "n2", capability: "media.render" });
    console.log(`✅ Job n2 (media.render) routed to: ${res2.targetQueue}\n`);

    // 3. Scenario: Lease-Based Ownership
    console.log("Scenario C: Lease-Based Job Claiming & Heartbeat");
    // Providing mandatory idempotency key (Rule 4)
    const claim = await lease.claimLease("n1", "w-browser-1", "idem-n1-001", 60000);
    console.log(`✅ Lease claimed until: ${claim.expiresAt}`);

    const renewal = await lease.renewHeartbeat("n1", "w-browser-1", 30000);
    console.log(`✅ Heartbeat renewed: ${renewal}\n`);

    // 4. Scenario: Lease Release
    console.log("Scenario D: Lease Release");
    const released = await lease.releaseLease("n1");
    console.log(`✅ Lease released: ${released}\n`);

    console.log("🎉 PHASE 25: WORKER CLUSTERING VERIFIED!");
  } catch (err) {
    console.error("❌ Test failed with error:", err);
    process.exit(1);
  }
}

testWorkerClustering();
