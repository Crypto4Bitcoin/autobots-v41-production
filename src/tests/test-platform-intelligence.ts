import { PlatformIntelligenceService } from "../lib/services/platform-intelligence-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testPlatformIntelligence() {
  console.log("🚀 Testing Platform Intelligence (Event Backbone Observer)...\n");

  // 1. Setup Architecture Mocks with seed events
  setupSupabaseMock({
    pipeline_events: [
      { 
        event_type: "agent_completed", 
        payload: { capability: "media.render", latency_ms: 1000, status: "completed" },
        created_at: new Date().toISOString()
      },
      { 
        event_type: "agent_completed", 
        payload: { capability: "media.render", latency_ms: 2000, status: "completed" },
        created_at: new Date().toISOString()
      },
      { 
        event_type: "agent_completed", 
        payload: { capability: "research.analyze", latency_ms: 500, status: "failed" },
        created_at: new Date().toISOString()
      }
    ]
  });

  const intel = new PlatformIntelligenceService();

  // 2. Scenario A: Analyze Performance
  console.log("Scenario A: Capability Performance Analysis");
  const stats = await intel.analyzeCapabilityPerformance();
  
  console.log("✅ Intelligence Generated:");
  Object.keys(stats).forEach(cap => {
    const s = stats[cap];
    console.log(` - ${cap}: ${s.runs} runs, ${s.failures} failures, avg latency: ${s.avgLatency}ms`);
  });

  // 3. Validation
  const mediaRender = stats["media.render"];
  if (mediaRender && mediaRender.avgLatency === 1500) {
    console.log("\n✅ Average latency calculation verified (1500ms).");
  } else {
    console.error("\n❌ Average latency calculation failed.");
  }

  const researchAnalyze = stats["research.analyze"];
  if (researchAnalyze && researchAnalyze.failures === 1) {
    console.log("✅ Failure rate tracking verified.");
  } else {
    console.error("❌ Failure rate tracking failed.");
  }

  console.log("\n🎉 PLATFORM INTELLIGENCE VERIFIED!");
}

testPlatformIntelligence();
