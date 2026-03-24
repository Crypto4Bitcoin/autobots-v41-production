import { DBService } from "./supabase-service";

export type SnapshotType = "workflow" | "projection" | "task_graph";

export interface IncrementalSnapshot {
  id: string;
  workflow_run_id: string;
  snapshot_type: SnapshotType;
  // Rule: Source stream range tracks covered events
  source_stream_range: { start_id: string; end_id: string };
  based_on_snapshot_id: string | null;
  state_data: unknown;
  snapshot_builder_version: string;
  schema_version: string;
  created_at: string;
}

export class IncrementalSnapshotService {
  private readonly BUILDER_VERSION = "1.0.0";
  private readonly SCHEMA_VERSION = "1.0.0";

  /**
   * Creates a tiered, incremental snapshot for a specific event range.
   */
  async createSnapshot(params: {
    workflowRunId: string;
    type: SnapshotType;
    range: { start_id: string; end_id: string };
    state: unknown;
    baseSnapshotId?: string;
  }): Promise<IncrementalSnapshot> {
    console.log(`[IncrementalSnapshot] Creating ${params.type} snapshot for ${params.workflowRunId} range ${params.range.start_id}..${params.range.end_id}`);

    const snapshot: Omit<IncrementalSnapshot, "id"> = {
      workflow_run_id: params.workflowRunId,
      snapshot_type: params.type,
      source_stream_range: params.range,
      based_on_snapshot_id: params.baseSnapshotId || null,
      state_data: params.state,
      snapshot_builder_version: this.BUILDER_VERSION,
      schema_version: this.SCHEMA_VERSION,
      created_at: new Date().toISOString()
    };

    const result = await DBService.upsertSnapshot(snapshot);
    
    await DBService.logEvent({
      event_type: "snapshot_checkpoint_anchored",
      workflow_run_id: params.workflowRunId,
      payload: { 
        snapshot_id: result.id, 
        type: params.type, 
        end_event_id: params.range.end_id 
      }
    });

    return result;
  }

  /**
   * Retrieves the latest range-aware snapshot for a workflow and type.
   */
  async getLatestSnapshot(workflowRunId: string, type: SnapshotType): Promise<IncrementalSnapshot | null> {
    return DBService.getLatestSnapshotByType(workflowRunId, type);
  }
}
