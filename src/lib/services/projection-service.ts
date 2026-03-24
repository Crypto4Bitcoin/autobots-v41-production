import { DBService } from "./supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PipelineState } from "../types/enums";

export interface PipelineHistoryItem {
  timestamp: string;
  event: string;
  from?: string;
  to?: string;
  actor?: string;
  details: unknown;
}

export class ProjectionService {
  /**
   * Reconstructs the timeline of events for a specific pipeline item.
   * This provides the "ground truth" history that exists independent of the queue.
   */
  static async getItemHistory(pipelineItemId: string): Promise<PipelineHistoryItem[]> {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: events, error } = await (DBService as any).supabase
      .from("pipeline_events")
      .select("*")
      .eq("pipeline_item_id", pipelineItemId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(`[Projection] Error fetching events for ${pipelineItemId}:`, error);
      return [];
    }

    return events.map((e: unknown) => ({
      timestamp: e.created_at,
      event: e.event_type,
      from: e.from_state,
      to: e.to_state,
      actor: e.actor,
      details: e.payload
    }));
  }

  /**
   * Verifies if the current state of a pipeline item in the database matches 
   * the projected state based on the last 'state_transitioned' event.
   */
  static async verifyStateIntegrity(pipelineItemId: string): Promise<boolean> {
    const [item, history] = await Promise.all([
      DBService.getPipelineItem(pipelineItemId),
      this.getItemHistory(pipelineItemId)
    ]);

    const transitionEvents = history.filter(h => h.event === "state_transitioned");
    if (transitionEvents.length === 0) return true; // No transitions yet

    const lastProjectedState = transitionEvents[transitionEvents.length - 1].to;
    return item.current_state === lastProjectedState;
  }
}
