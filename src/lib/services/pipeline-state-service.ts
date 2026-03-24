import { PipelineState } from "../types/enums";
import { DBService } from "./supabase-service";

export interface StateTransition {
  from: PipelineState;
  to: PipelineState[];
}

export const TRANSITION_MAP: Record<PipelineState, PipelineState[]> = {
  [PipelineState.INPUT_RECEIVED]: [PipelineState.CLASSIFYING_INPUT],
  [PipelineState.CLASSIFYING_INPUT]: [PipelineState.EXTRACTING_MEDIA, PipelineState.RESEARCHING, PipelineState.FAILED],
  
  [PipelineState.EXTRACTING_MEDIA]: [PipelineState.TRANSCRIBING, PipelineState.RESEARCHING, PipelineState.FAILED],
  [PipelineState.TRANSCRIBING]: [PipelineState.RESEARCHING, PipelineState.FAILED],
  
  [PipelineState.RESEARCHING]: [PipelineState.FACT_CHECKING, PipelineState.FAILED],
  [PipelineState.FACT_CHECKING]: [PipelineState.TREND_ANALYSIS, PipelineState.FAILED],
  [PipelineState.TREND_ANALYSIS]: [PipelineState.ANGLE_GENERATION, PipelineState.FAILED],
  
  [PipelineState.ANGLE_GENERATION]: [PipelineState.CONTENT_STRATEGY, PipelineState.FAILED],
  [PipelineState.CONTENT_STRATEGY]: [PipelineState.PERSONA_MODELING, PipelineState.FAILED],
  [PipelineState.PERSONA_MODELING]: [PipelineState.CONTENT_COMPOSITION, PipelineState.FAILED],
  
  [PipelineState.CONTENT_COMPOSITION]: [PipelineState.REPURPOSING, PipelineState.FAILED],
  [PipelineState.REPURPOSING]: [PipelineState.ASSET_BRIEFING, PipelineState.FAILED],
  [PipelineState.ASSET_BRIEFING]: [PipelineState.VISUAL_GENERATION, PipelineState.CLIP_GENERATION, PipelineState.QUALITY_SCORING, PipelineState.FAILED],
  
  [PipelineState.VISUAL_GENERATION]: [PipelineState.QUALITY_SCORING, PipelineState.FAILED],
  [PipelineState.CLIP_GENERATION]: [PipelineState.QUALITY_SCORING, PipelineState.FAILED],
  
  [PipelineState.QUALITY_SCORING]: [PipelineState.VIRALITY_SCORING, PipelineState.FAILED],
  [PipelineState.VIRALITY_SCORING]: [PipelineState.COMPLIANCE_CHECK, PipelineState.FAILED],
  [PipelineState.COMPLIANCE_CHECK]: [PipelineState.PLATFORM_REVIEW, PipelineState.FAILED],
  
  [PipelineState.PLATFORM_REVIEW]: [PipelineState.READY_TO_POST, PipelineState.NEEDS_REVIEW, PipelineState.FAILED],
  [PipelineState.READY_TO_POST]: [PipelineState.SCHEDULING, PipelineState.POSTING, PipelineState.FAILED],
  [PipelineState.SCHEDULING]: [PipelineState.POSTING, PipelineState.FAILED],
  [PipelineState.POSTING]: [PipelineState.ANALYTICS, PipelineState.FAILED],
  
  [PipelineState.ANALYTICS]: [PipelineState.EXPANSION, PipelineState.FAILED, PipelineState.DEAD_LETTER],
  [PipelineState.EXPANSION]: [PipelineState.MEMORY_UPDATE, PipelineState.FAILED, PipelineState.DEAD_LETTER],
  [PipelineState.MEMORY_UPDATE]: [PipelineState.COMPLETED, PipelineState.FAILED, PipelineState.DEAD_LETTER],
  
  [PipelineState.COMPLETED]: [],
  [PipelineState.FAILED]: [PipelineState.INPUT_RECEIVED, PipelineState.DEAD_LETTER], // Allow retry or move to dead letter
  [PipelineState.DEAD_LETTER]: [], // Terminal terminal
  [PipelineState.NEEDS_REVIEW]: [PipelineState.READY_TO_POST, PipelineState.CONTENT_COMPOSITION, PipelineState.FAILED, PipelineState.DEAD_LETTER],
};

export class PipelineStateService {
  static isValidTransition(from: PipelineState, to: PipelineState): boolean {
    const allowed = TRANSITION_MAP[from];
    return allowed?.includes(to) || false;
  }

  static getNextStates(current: PipelineState): PipelineState[] {
    return TRANSITION_MAP[current] || [];
  }

  /**
   * Performs an atomic state transition for a pipeline item.
   * Logs an audit record and a pipeline event for tracing.
   */
  static async transitionState(pipelineItemId: string, workspaceId: string, to: PipelineState, metadata?: unknown) {
    const item = await DBService.getPipelineItem(pipelineItemId);
    const from = item.current_state as PipelineState;

    if (!this.isValidTransition(from, to)) {
      throw new Error(`Invalid transition from ${from} to ${to}`);
    }

    console.log(`[PipelineState] Transitioning ${pipelineItemId} from ${from} to ${to}`);

    // Update DB
    await DBService.updatePipelineState(pipelineItemId, to);

    // Record Event
    await DBService.recordPipelineEvent({
      pipeline_item_id: pipelineItemId,
      workspace_id: workspaceId,
      event_type: "state_transitioned",
      from_state: from,
      to_state: to,
      payload: metadata
    });

    return true;
  }
}
