import { OneClickContentMachineService, IntelligenceEngineService } from "../lib/services/one-click-viral-services";
import { AutomateAnythingCompiler } from "../lib/services/automate-anything-compiler";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function runPhase48Tests() {
  console.log("?? Testing Phase 48: Viral Growth Drivers (One-Click Experiences)\n");
  setupSupabaseMock();

  const workspaceId = "ws-viral-101";

  // 1. One-Click Content Machine
  console.log("Test 1: One-Click Content Machine (Paste Link -> Full Content Kit)...");
  try {
     const result = await OneClickContentMachineService.generateFromLink(workspaceId, "https://youtube.com/watch?v=viral-video");
     if (result.artifacts.twitterThread && result.artifacts.shortClips.length === 3) {
         console.log("? Passed: Instantly generated multi-format artifacts from a single URL.");
     } else {
         console.error("? Failed.");
     }
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 2. Intelligence Engine
  console.log("\nTest 2: Intelligence Engine (Paste Any Link -> Get Intelligence)...");
  try {
     const result = await IntelligenceEngineService.analyzeLink(workspaceId, "https://research-article.com");
     if (result.insights.contradictionsFound.length > 0 && result.insights.factCheck) {
         console.log("? Passed: Instantly extracted insights, fact checks, and contradictions from a URL.");
     } else {
         console.error("? Failed.");
     }
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 3. Automate Anything Compiler
  console.log("\nTest 3: Automate Anything Compiler (NL Prompt -> Generated DAG Workflow)...");
  try {
     const prompt = "Monitor crypto news and post a daily summary to my Twitter.";
     const compiled = await AutomateAnythingCompiler.compilePromptToWorkflow(prompt);
     if (compiled.definition.trigger === "schedule_daily" && compiled.definition.nodes.length === 4) {
         console.log("? Passed: Successfully translated natural language intent into an executable DAG pipeline.");
     } else {
         console.error("? Failed to map DAG correctly.");
     }
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  console.log("\n?? PHASE 48: VIRAL GROWTH DRIVERS COMPLETED!");
}

runPhase48Tests();
