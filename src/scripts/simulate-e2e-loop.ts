import { UnifiedReliabilityLoopService } from "../lib/services/unified-reliability-loop.service";

async function runSimulation() {
  console.log("--- STARTING E2E UNIFIED RELIABILITY LOOP SIMULATION ---");
  
  const mockSignal = {
    type: "web_error",
    error_code: "404",
    message: "Global Console sidebar link broken",
    trace_id: "trace-unique-123",
    source: "SentinelAgent"
  };

  await UnifiedReliabilityLoopService.processSignal(mockSignal);
  
  console.log("--- SIMULATION FINISHED ---");
}

runSimulation().catch(console.error);
