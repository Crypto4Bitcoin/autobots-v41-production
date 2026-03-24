import { VoiceIntent, VoiceExecutionPlan } from "../types/voice-intelligence-types";
import { ConversationContextService } from "./conversation-context-service";

export class CommandPlannerService {
  /**
   * Translates a governed VoiceIntent into a structured execution plan.
   * Handles multi-step requests and named macros.
   */
  static async plan(intent: VoiceIntent): Promise<VoiceExecutionPlan> {
    console.log(`[CommandPlanner] Planning for intent: ${intent.intentName}`);
    
    // 1. Resolve References from Context if any
    let target = "system";
    if (intent.unresolvedReferences && intent.unresolvedReferences.length > 0) {
      const ref = ConversationContextService.resolveOrdinalReference(intent.unresolvedReferences[0]);
      if (ref) target = ref.id;
    }

    // 2. Handle Named Macros / Routines
    if (intent.entities.routine === "morning_brief") {
      return {
        units: [
          { type: "workflow_trigger", target: "discovery_workflow", payload: { query: "trending technology" } },
          { type: "workflow_trigger", target: "composition_workflow", payload: { format: "summary" }, dependsOn: "discovery" }
        ],
        explanation: "Running the morning research and composition macro.",
        reasonCode: "macro_execution_morning_brief"
      };
    }

    // 3. Plan for Workflow Assembly (New in Phase 12)
    if (intent.intentName === "workflow_assembly_request") {
      const isCustom = intent.rawUtterance.includes("build") || intent.rawUtterance.includes("assemble");
      
      return {
        units: [{ 
          type: "workflow_assembly", 
          target: "assembler", 
          payload: { 
            title: intent.entities.routine || "Custom Workflow",
            isCustom 
          } 
        }],
        explanation: `Assembling a ${isCustom ? "custom" : "template-based"} workflow draft for: ${intent.entities.routine || "your request"}.`,
        reasonCode: "assembly_plan_generation"
      };
    }

    // 4. Plan for Worklow Retry

    // 4. Plan for External Publish
    if (intent.intentName === "external_publish_request") {
      return {
        units: [{ type: "action", target, payload: { action: "publish", platform: intent.entities.platform || "all" } }],
        explanation: `Publishing ${intent.entities.time_hint || "latest"} content to ${intent.entities.platform || "all channels"}.`,
        reasonCode: "direct_action_publish"
      };
    }

    // 5. Default Informational Query
    return {
      units: [{ type: "query", target: "system", payload: { q: intent.intentName } }],
      explanation: "Fetching current system status.",
      reasonCode: "informational_query"
    };
  }
}
