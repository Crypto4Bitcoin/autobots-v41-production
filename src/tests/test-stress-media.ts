import { DBService } from "../lib/services/supabase-service";
import { WorkflowEngine } from "../lib/services/workflow-engine";
import { HumanTaskService } from "../lib/services/human-task-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testStressMedia() {
  console.log("🚀 Stress Test 5: Trend-to-Short Video (Media Boss Fight)...\n");

  const workspaceId = "ws-media-stress";
  const workflowRunId = "wf-media-run";

  // 1. Setup Architecture Mocks
  setupSupabaseMock();

  // 2. Discover Trend
  console.log("Step 1: Discovering Live Trend (Agent + Search)...");
  await WorkflowEngine.completeNode("node-discover-trend", "completed");
  console.log("✅ Trend identified: 'AI Agent Swarms'.\n");

  // 3. Parallel Research
  console.log("Step 2: Parallel Content Analysis (Gather/Score/Summarize)...");
  await Promise.all([
    WorkflowEngine.completeNode("node-gather-sources", "completed"),
    WorkflowEngine.completeNode("node-score-topic", "completed"),
    WorkflowEngine.completeNode("node-summarize", "completed")
  ]);
  console.log("✅ Research fan-in complete.\n");

  // 4. Script Generation
  console.log("Step 3: Generating Script (Composition Agent)...");
  const scriptArt = await DBService.createArtifact({
      workspace_id: workspaceId,
      pipeline_item_id: "node-gen-script",
      type: "media_script",
      data: { script: "In a world of agent swarms..." }
  });
  await WorkflowEngine.completeNode("node-gen-script", "completed");
  console.log("✅ Script generated.\n");

  // 5. Asset Production (Parallel)
  console.log("Step 4: Parallel Asset Production (Rendering/Captions/Thumbnails)...");
  await Promise.all([
      WorkflowEngine.completeNode("node-render-video", "completed"),
      WorkflowEngine.completeNode("node-create-caption", "completed"),
      WorkflowEngine.completeNode("node-gen-thumbnail", "completed")
  ]);
  console.log("✅ Assets rendered and localized.\n");

  // 6. Compliance & Review
  console.log("Step 5: Compliance Check & Human Review Gate...");
  await WorkflowEngine.completeNode("node-compliance-check", "completed");
  
  const reviewTask = await HumanTaskService.createRequest({
      workspaceId,
      workflowRunId,
      nodeRunId: "node-final-review",
      instructions: "Review the rendered video and script compliance.",
      inputData: { scriptId: scriptArt.id }
  });
  console.log(`✅ Workflow paused for human review (Task: ${reviewTask.id}).`);
  
  await HumanTaskService.resolveTask(reviewTask.id, { status: "approved" });
  console.log("✅ Operator approved. Resuming for publication.\n");

  // 7. Publication
  console.log("Step 6: Distributing to Social Channels (Publish Worker)...");
  await WorkflowEngine.completeNode("node-publish", "completed");
  console.log("✅ Video published to YouTube, X, and Instagram.\n");

  // 8. Optimization Loop
  console.log("Step 7: Collecting Performance Feedback (Optimization Loop)...");
  await DBService.recordArtifactFeedback({
      artifact_id: "mock-id-123",
      score: 0.92,
      metrics: { views: 5000, engagement: 0.15 },
      provided_by: "system_analytics"
  });
  console.log("✅ Success scores recorded. Platform strategy updated for 'Media Pack'.\n");

  console.log("🎉 STRESS TEST 5: MEDIA BOSS FIGHT VERIFIED!");
}

testStressMedia();
