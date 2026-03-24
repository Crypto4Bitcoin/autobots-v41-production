import { WorkflowHealthSupervisor } from "../lib/services/workflow-health-supervisor";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testWorkflowSupervisor() {
  console.log("🚀 Testing Phase 15: Platform Health Supervision...\n");

  // 1. Setup Architecture Mocks with boundary scenarios
  setupSupabaseMock({
    pipeline_events: [
      // Media Render: High Latency (Avg > 10s)
      { 
        event_type: "agent_completed", 
        payload: { capability: "media.render", latency_ms: 15000, status: "completed" },
        created_at: new Date().toISOString()
      },
      // Social Post: High Failure Rate (> 20%)
      { 
        event_type: "agent_completed", 
        payload: { capability: "social.post", latency_ms: 200, status: "failed" },
        created_at: new Date().toISOString()
      },
      { 
        event_type: "agent_completed", 
        payload: { capability: "social.post", latency_ms: 200, status: "completed" },
        created_at: new Date().toISOString()
      },
      { 
        event_type: "agent_completed", 
        payload: { capability: "social.post", latency_ms: 200, status: "failed" },
        created_at: new Date().toISOString()
      }
    ]
  });

  const supervisor = new WorkflowHealthSupervisor();

  // 2. Scenario A: Analyze Platform Health
  console.log("Scenario A: Detecting Performance Violations");
  const alerts = await supervisor.analyzePlatformHealth();
  
  console.log("✅ Supervision Alerts Generated:");
  alerts.forEach(a => {
    console.log(` - [${a.type.toUpperCase()}] ${a.capability}: ${a.message}`);
  });

  // 3. Validation
  const latencyAlert = alerts.find(a => a.type === "latency_warning" && a.capability === "media.render");
  if (latencyAlert) {
    console.log("\n✅ Latency violation accurately detected for media.render.");
  } else {
    console.error("\n❌ FAILED to detect latency violation.");
  }

  const failureAlert = alerts.find(a => a.type === "failure_rate_warning" && a.capability === "social.post");
  if (failureAlert) {
    console.log("✅ Failure rate violation accurately detected for social.post.");
  } else {
    console.error("❌ FAILED to detect failure rate violation.");
  }

  console.log("\n🎉 PHASE 15: PLATFORM HEALTH SUPERVISION VERIFIED!");
}

testWorkflowSupervisor();
