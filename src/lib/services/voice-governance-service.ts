import { GovernanceService } from "./governance-service";
import { VoiceActionClass, VoiceGovernanceOutcome, VoiceIntent } from "../types/voice-intelligence-types";

export interface GovernanceDecision {
  outcome: VoiceGovernanceOutcome;
  reason: string;
  reasonCode: string;
}

export class VoiceGovernanceService {
  /**
   * The central decision gate for voice-triggered interactions.
   * Evaluates if a structured intent is allowed to proceed to execution.
   */
  static async decide(workspaceId: string, userId: string, intent: VoiceIntent): Promise<GovernanceDecision> {
    console.log(`[VoiceGovernance] Deciding on intent: ${intent.intentName} (${intent.actionClass})`);

    // 1. Simulation Mode Override
    if (intent.isSimulationRequested) {
      return { 
        outcome: VoiceGovernanceOutcome.SIMULATE, 
        reason: "Simulation mode requested by operator.", 
        reasonCode: "simulation_mode_active" 
      };
    }

    // 2. Class-Based Safety Gates
    if (intent.actionClass === VoiceActionClass.INFORMATIONAL) {
      return { 
        outcome: VoiceGovernanceOutcome.ALLOW, 
        reason: "Informational queries are safe and immediate.", 
        reasonCode: "informational_auto_allow" 
      };
    }

    // 3. Workspace Governance Profile Integration
    const profile = await GovernanceService.getProfile(workspaceId);
    if (!profile) {
       return { 
         outcome: VoiceGovernanceOutcome.DENY, 
         reason: "No workspace governance profile found. Voice actions restricted.", 
         reasonCode: "governance_profile_missing" 
       };
    }

    // 4. Budget & Threshold Check
    if (profile.currentMonthlySpendUsd >= profile.maxMonthlyBudgetUsd) {
        return { 
          outcome: VoiceGovernanceOutcome.DENY, 
          reason: "Monthly budget exceeded for this workspace.", 
          reasonCode: "budget_limit_reached" 
        };
    }

    // 5. Confidence Score Gate
    if (intent.confidence < 0.8) {
        return { 
          outcome: VoiceGovernanceOutcome.CONFIRM, 
          reason: "I think I understood, but I'd like to confirm before executing.", 
          reasonCode: "intent_confidence_low" 
        };
    }

    // 6. Draft-First Rule for Assembly
    if (intent.intentName === "workflow_assembly_request") {
        return {
          outcome: VoiceGovernanceOutcome.PROPOSAL,
          reason: "New workflow assembly requested. Generating a draft for your review.",
          reasonCode: "assembly_proposal_draft"
        };
    }

    // 7. Action Class / Trust Tier Rules
    switch (intent.actionClass) {
      case VoiceActionClass.PREPARATORY:
        return { 
          outcome: VoiceGovernanceOutcome.ALLOW, 
          reason: "Preparatory drafting and planning allowed.", 
          reasonCode: "preparatory_auto_allow" 
        };

      case VoiceActionClass.OPERATIONAL:
        // Operational changes require confirmation unless specifically allowed
        return { 
          outcome: VoiceGovernanceOutcome.CONFIRM, 
          reason: `Changing system state (${intent.intentName}) requires operator confirmation.`, 
          reasonCode: "operational_confirmation_needed" 
        };

      case VoiceActionClass.SIDE_EFFECTFUL:
        // Side-effectful ALWAYS requires confirmation and often human review logic
        return { 
          outcome: VoiceGovernanceOutcome.CONFIRM, 
          reason: "External publishing or side-effectful actions require explicit voice confirmation.", 
          reasonCode: "side_effectful_confirmation_required" 
        };

      default:
        return { 
          outcome: VoiceGovernanceOutcome.DENY, 
          reason: "Unknown action class cannot be governed.", 
          reasonCode: "unknown_action_class" 
        };
    }
  }
}
