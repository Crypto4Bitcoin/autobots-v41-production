import { supabase } from "./supabase-service";

export interface RecommendationFeedback {
  goalText: string;
  templateId?: string;
  packSlug?: string;
  outcome: "accepted" | "rejected" | "abandoned";
}

export class RecommendationFeedbackService {
  /**
   * Records user interaction with a recommendation.
   */
  static async recordFeedback(feedback: RecommendationFeedback) {
    console.log(`[RecommendationFeedback] Recording feedback for '${feedback.goalText}': ${feedback.outcome}`);
    
    const { error } = await supabase
      .from("workflow_recommendation_feedback")
      .insert([{
        goal_text: feedback.goalText,
        template_id: feedback.templateId,
        pack_slug: feedback.packSlug,
        outcome: feedback.outcome,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error("[RecommendationFeedback] Error recording feedback:", error);
    }
  }

  /**
   * Records a proposed draft workflow.
   */
  static async createProposal(proposal: {
    workspaceId: string;
    proposedBy: string;
    goalPrompt: string;
    recommendedPack?: string;
    recommendedTemplate?: string;
    draftDefinition: unknown;
  }) {
    console.log(`[RecommendationFeedback] Persisting proposal for goal: ${proposal.goalPrompt}`);
    
    const { data, error } = await supabase
      .from("workflow_proposals")
      .insert([{
        workspace_id: proposal.workspaceId,
        proposed_by: proposal.proposedBy,
        goal_prompt: proposal.goalPrompt,
        recommended_pack: proposal.recommendedPack,
        recommended_template: proposal.recommendedTemplate,
        draft_definition: proposal.draftDefinition,
        status: "pending",
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
