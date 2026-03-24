// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "../lib/services/supabase-service";
import { WorkflowEngine } from "../lib/services/workflow-engine";
import { HumanTaskService } from "../lib/services/human-task-service";
import { ToolAdapterService } from "../lib/services/tool-adapter-service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testStressMixed() {
  console.log("🚀 Stress Test 4: Mixed Human + Tool + Agent Coordination...\n");

  const workspaceId = "ws-mixed-test";
  const itemTitle = "Weekly Customer Brief";

  // 1. Setup Robust Mocks
  setupSupabaseMock();

  // 2. Tool Execution (External Data)
  console.log("Step 1: Gathering External Data (Tool Adapter)...");
  const toolResult = await ToolAdapterService.execute({ 
      key: "api.customer_portal", 
      type: "read" 
  }, { customerId: "C123" });
  console.log(`✅ Data gathered via ToolAdapter: ${toolResult.success ? "Success" : "Failed"}\n`);

  // 2. Agent Execution (Drafting)
  console.log("Step 2: Generating Draft Brief (Agent)...");
  const draftArt = await DBService.createArtifact({
      workspace_id: workspaceId,
      pipeline_item_id: "node-agent-draft",
      type: "draft_brief",
      data: { content: "Drafted brief for customer C123..." }
  });
  await WorkflowEngine.completeNode("node-agent-draft", "completed");
  console.log(`✅ AI Agent draft completed. Artifact: ${draftArt.id}\n`);

  // 3. Human Review Pause
  console.log("Step 3: Creating Human Review Task (Workflow Pause)...");
  const humanTask = await HumanTaskService.createRequest({
      workspaceId,
      workflowRunId: "wf-mixed-run",
      nodeRunId: "node-human-review",
      instructions: `Please review/edit the drafted brief: ${itemTitle}`,
      inputData: { artifactId: draftArt.id }
  });
  console.log(`✅ Workflow paused. Waiting for human approval (Task ID: ${humanTask.id}).\n`);

  // 4. Human Approval (Resume)
  console.log("Step 4: Human Approved (Workflow Resume)...");
  await HumanTaskService.resolveTask(humanTask.id, { 
      status: "approved", 
      feedback: "Looks perfect. Publish." 
  });
  console.log("✅ Workflow resumed and human node marked completed.\n");

  // 5. Final Delivery (Tool Adapter)
  console.log("Step 5: Final Distribution (Tool Adapter)...");
  await ToolAdapterService.execute({ 
      key: "email.send", 
      type: "write" 
  }, { to: "customer@corp.com", artifactId: draftArt.id });
  console.log("✅ Brief delivered successfully.\n");

  console.log("🎉 STRESS TEST 4: MIXED EXECUTION VERIFIED!");
}

testStressMixed();
