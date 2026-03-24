// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Orchestrator, QueueService } from "./lib/orchestrator/orchestrator";
import { initializeAgentRegistry } from "./lib/orchestrator/agent-registry";
import { WatchdogService } from "./lib/services/watchdog-service";
import { PipelineState } from "./lib/types/enums";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyVerticalSlice() {
  console.log("--- VERTICAL SLICE VERIFICATION ---");
  
  // 1. Initialize Services
  initializeAgentRegistry();
  QueueService.startWorker();
  WatchdogService.start();

  const mockPipelineItemId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"; // Mock UUID
  const mockWorkspaceId = "00000000-0000-0000-0000-000000000001";
  
  console.log(`[Test] Launching pipeline for item ${mockPipelineItemId}`);
  
  // 2. Start the pipeline
  await QueueService.enqueue({
    pipelineItemId: mockPipelineItemId,
    workspaceId: mockWorkspaceId, // Fixed: Added required workspaceId
    targetState: PipelineState.INPUT_RECEIVED,
    payload: { source: "https://example.com/ai-trends" }
  });

  console.log("[Test] Pipeline launched. Monitoring logs...");
}

// In a real environment, this would be a script or test suite
// verifyVerticalSlice();
