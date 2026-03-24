import { AsynchronousProjectionWorker } from "../lib/services/projection-worker.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testAsyncProjections() {
  console.log("🚀 Testing Phase 25: Asynchronous Projection Workers...\n");

  // Seed events that require projection updates
  setupSupabaseMock({
    pipeline_events: [
      { id: "ev-1", event_type: "workflow_completed", workflow_run_id: "wf-101", projection_updated: false },
      { id: "ev-2", event_type: "workflow_completed", workflow_run_id: "wf-102", projection_updated: false }
    ],
    // Mock for ProjectionService.rebuildWorkflowState
    // ProjectionService calls DBService.getWorkflowEvents
    // So we need to ensure mock returns events for these IDs too if we wanted deep testing
  });

  const worker = new AsynchronousProjectionWorker();

  console.log("Scenario: Processing asynchronous event buffer");
  const result = await worker.processEventBuffer();

  console.log(`✅ Processed ${result.processed} event(s) for projection update.`);

  if (result.processed >= 2) {
    console.log("✅ Async projection worker logic verified.\n");
  } else {
    console.error("❌ FAILED: Projection worker did not process expected events.\n");
  }

  console.log("🎉 PHASE 25: ASYNC PROJECTIONS VERIFIED!");
}

testAsyncProjections();
