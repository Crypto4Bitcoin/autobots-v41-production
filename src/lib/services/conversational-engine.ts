// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Orchestrator } from "../orchestrator/orchestrator";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "./supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorkflowDefinitionService } from "./workflow-definition-service";

export class ConversationalCommandEngine {
  /**
   * Processes a natural language command and executes the corresponding platform action.
   */
  static async processCommand(input: string, workspaceId: string): Promise<string> {
    console.log(`[ConversationalEngine] Processing: "${input}"`);
    const normalized = input.toLowerCase();

    // 1. Status Inquiry
    if (normalized.includes("status") || normalized.includes("what is happening")) {
        return await this.generateStatusReport(workspaceId);
    }

    // 2. Trigger Workflow
    if (normalized.includes("start") || normalized.includes("run") || normalized.includes("research")) {
        const type = normalized.includes("research") ? "research" : "general";
        // Mock triggering a workflow
        return `I've started a ${type} workflow for you. I'll let you know when it needs your review.`;
    }

    // 3. Approval Actions
    if (normalized.includes("approve") || normalized.includes("publish")) {
        return "I've processed your approval. The workflow is now continuing to the distribution stage.";
    }

    return "I'm not quite sure how to help with that yet. You can ask me for a status report or to start a new workflow.";
  }

  /**
   * Generates a verbal summary of active workspace items.
   */
  static async generateStatusReport(workspaceId: string): Promise<string> {
    const { data: runs } = await supabase
        .from("workflow_runs")
        .select("status, workflow_id")
        .eq("workspace_id", workspaceId)
        .neq("status", "completed")
        .limit(5);

    if (!runs || runs.length === 0) {
        return "Everything is quiet. No active workflows are running right now.";
    }

    const waiting = runs.filter(r => r.status === "waiting").length;
    const active = runs.filter(r => r.status === "processing" || r.status === "runnable").length;

    let report = `You have ${active} active workflows in progress.`;
    if (waiting > 0) {
        report += ` There are ${waiting} tasks waiting for your approval.`;
    }

    return report;
  }
}
