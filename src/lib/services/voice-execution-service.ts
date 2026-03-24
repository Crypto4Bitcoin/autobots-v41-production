// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Orchestrator } from "../orchestrator/orchestrator";
import { VoiceExecutionPlan, VoiceGovernanceOutcome } from "../types/voice-intelligence-types";

export class VoiceExecutionService {
  /**
   * Dispatches an already-governed execution plan.
   * This is the "dumb" layer that performs the final dispatch.
   */
  static async execute(plan: VoiceExecutionPlan, outcome: VoiceGovernanceOutcome): Promise<{ status: string, feedback: string }> {
    console.log(`[VoiceExecution] Dispatching plan. Outcome: ${outcome}`);

    // If decision was to deny or hold, do not execute
    if (outcome === VoiceGovernanceOutcome.DENY || outcome === VoiceGovernanceOutcome.HOLD) {
      return { status: "blocked", feedback: "Action denied or held by governance." };
    }

    if (outcome === VoiceGovernanceOutcome.SIMULATE) {
        return { 
          status: "simulated", 
          feedback: `[SIMULATION] ${plan.explanation}. Status codes: ${plan.units.map(u => u.type).join(', ')}`
        };
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (outcome === VoiceGovernanceOutcome.PROPOSAL as any) {
        return {
          status: "proposed",
          feedback: `[DRAFT PROPOSED] ${plan.explanation}. This workflow has been saved as a draft and requires your review before activation.`
        };
    }

    // Process units
    for (const unit of plan.units) {
      console.log(`[VoiceExecution] Dispatching unit: ${unit.type} -> ${unit.target}`);
      
      if (unit.type === "workflow_assembly") {
         console.log(`[Orchestrator] Saving assembled draft DAG: ${unit.payload.title}`);
         // Mocked saving to a drafts table
      } 
      else if (unit.type === "workflow_trigger") {
        // Mocked orchestrator workflow trigger
        console.log(`[Orchestrator] Triggering workflow: ${unit.target}`);
      } else if (unit.type === "action") {
        // Mocked direct state modification
        console.log(`[Orchestrator] Performing action: ${unit.payload.action} on ${unit.target}`);
      } else if (unit.type === "query") {
        console.log(`[Orchestrator] Querying: ${unit.payload.q}`);
      }
    }

    return { status: "success", feedback: plan.explanation };
  }
}
