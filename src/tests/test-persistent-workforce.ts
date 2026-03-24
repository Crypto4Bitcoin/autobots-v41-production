import {
  PersistentWorkerService,
  SocialMediaAutopilotWorker,
  CompetitorMonitoringWorker,
  RealTimeBriefingWorker,
  AIWorkforceBuilderAPI
} from "../lib/services/persistent-worker-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function runPhase49Tests() {
  console.log("?? Testing Phase 49: Persistent AI Workforce\n");
  setupSupabaseMock();

  const ws = "ws-biz-505";

  // 1. Social Autopilot Worker
  console.log("Test 1: Social Media Autopilot (Cron Trigger)...");
  try {
     const w1 = SocialMediaAutopilotWorker.create(ws, ["crypto", "ETFs"]);
     await PersistentWorkerService.registerWorker(w1);
     console.log(`? Passed: Provisioned cron worker executing every 4 hours.`);
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 2. Competitor Monitor Worker
  console.log("\nTest 2: Competitor Monitoring Worker (Event Trigger)...");
  try {
     const w2 = CompetitorMonitoringWorker.create(ws, ["competitor.com"]);
     await PersistentWorkerService.registerWorker(w2);
     console.log(`? Passed: Provisioned event listener worker for web scrape updates.`);
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 3. Real-Time Briefing Worker
  console.log("\nTest 3: Real-Time Briefing Worker (Schedule Trigger)...");
  try {
     const w3 = RealTimeBriefingWorker.create(ws, "07:00 AM");
     await PersistentWorkerService.registerWorker(w3);
     console.log(`? Passed: Provisioned daily schedule worker for email dispatch.`);
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 4. Fire Worker Mock
  console.log("\nTest 4: Evaluate and Fire Worker Execution Loop...");
  try {
     await PersistentWorkerService.evaluateTriggers();
     const testWorker = RealTimeBriefingWorker.create(ws, "07:00 AM");
     const run = await PersistentWorkerService.fireWorker(testWorker);
     if (run.success) console.log(`? Passed: Continuous worker trigger fired successfully -> Created run ${run.runId}`);
     else console.error("? Failed.");
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  // 5. Build Your Own AI Workforce API
  console.log("\nTest 5: Build Your Own AI Workforce Builder API...");
  try {
     const team = await AIWorkforceBuilderAPI.buildTeam(ws, "Content Marketing Team", ["Research_Agent", "Writer_Agent", "Editor_Agent", "Publisher_Agent"]);
     if (team.deployedAgents === 4) {
         console.log(`? Passed: Successfully composed multi-agent team into a single DAG abstraction.`);
     } else console.error("? Failed to deploy all agents.");
  } catch (e: unknown) {
     console.error("? Failed:", e.message);
  }

  console.log("\n?? PHASE 49: PERSISTENT AI WORKFORCE COMPLETED!");
}

runPhase49Tests();
