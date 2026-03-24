import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { PipelineState } from "../types/enums";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export class DBService {
  static async getPipelineItem(id: string) {
    const { data, error } = await supabase
      .from("pipeline_items")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updatePipelineState(id: string, newState: PipelineState) {
    const { data, error } = await supabase
      .from("pipeline_items")
      .update({ current_state: newState }) 
      .eq("id", id)
      .select();
    
    if (error) throw error;
    return data;
  }

  static async logAgentRun(run: {
    pipeline_item_id: string;
    workspace_id: string;
    agent_name: string;
    input_state: string;
    output_state?: string;
    status: string;
    provider_used?: string;
    latency_ms?: number;
    tokens_used?: number;
    error_message?: string;
    input_data?: unknown;
    output_data?: unknown;
    started_at: string;
    completed_at: string;
    metadata?: unknown;
  }) {
    const { data, error } = await supabase
      .from("agent_runs")
      .insert([run])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async fetchPendingNodeRun(workerId: string) {
    const { data, error } = await supabase.rpc("claim_next_node_run", {
      p_worker_id: workerId
    });
    if (error) {
      if (error.code === 'P0001') return null;
      throw error;
    }
    return data;
  }

  static async updateNodeRunStatus(id: string, status: string, artifactId?: string) {
    const { data, error } = await supabase
      .from("node_runs")
      .update({ status, output_artifact_id: artifactId, completed_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async logAudit(log: {
    pipeline_item_id?: string;
    workspace_id: string;
    action: string;
    actor: string;
    details?: unknown;
  }) {
    const { error } = await supabase
      .from("audit_logs")
      .insert([log]);
    
    if (error) console.error("Failed to write audit log:", error);
  }

  static async logEvent(event: {
    event_type: string;
    workspace_id?: string;
    workflow_run_id?: string;
    node_run_id?: string;
    payload?: unknown;
  }) {
    const { data, error } = await supabase
      .from("pipeline_events")
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Durable Queue Methods
  static async enqueueJob(job: {
    pipeline_item_id: string;
    workspace_id: string;
    target_state: string;
    payload?: unknown;
  }) {
    const { data, error } = await supabase
      .from("job_queue")
      .insert([job])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async fetchPendingJob(workerId: string) {
    const { data, error } = await supabase.rpc("claim_next_job", {
      worker_id_param: workerId
    });

    if (error || !data || data.length === 0) {
      if (error) console.error("[DBService] Claim RPC error:", error);
      return null;
    }

    const job = data[0];
    
    await this.logAudit({
      pipeline_item_id: job.pipeline_item_id,
      workspace_id: job.workspace_id,
      action: "queue_claimed",
      actor: workerId,
      details: { job_id: job.id }
    });

    return job;
  }

  static async updateJobStatus(id: string, status: string, errorLog?: string, workerId?: string) {
    const isProcessing = status === "processing";
    
    const { data: job } = await supabase
      .from("job_queue")
      .select("workspace_id, pipeline_item_id")
      .eq("id", id)
      .single();

    await supabase
      .from("job_queue")
      .update({ 
        status, 
        error_log: errorLog, 
        locked_at: isProcessing ? new Date().toISOString() : null,
        locked_by: isProcessing ? (workerId || null) : null
      })
      .eq("id", id);

    if (job) {
      const action = status === "completed" ? "queue_completed" : 
                    status === "failed" ? "agent_failed" : 
                    status === "dead_letter" ? "queue_dead_lettered" : `status_update_${status}`;
      
      await this.logAudit({
        pipeline_item_id: job.pipeline_item_id,
        workspace_id: job.workspace_id,
        action,
        actor: workerId || "system",
        details: { job_id: id, status }
      });
    }
  }

  static async failJobWithRetry(id: string, errorMessage: string, workerId: string) {
    const { data: job } = await supabase
      .from("job_queue")
      .select("workspace_id, pipeline_item_id, attempts, max_attempts")
      .eq("id", id)
      .single();
      
    if (!job) return;

    const nextAttempts = (job.attempts || 0) + 1;
    const terminal = nextAttempts >= (job.max_attempts || 3);
    const newStatus = terminal ? "dead_letter" : "pending";

    await supabase
      .from("job_queue")
      .update({
        status: newStatus,
        attempts: nextAttempts,
        error_log: errorMessage,
        locked_at: null,
        locked_by: null
      })
      .eq("id", id);

    await this.logAudit({
      pipeline_item_id: job.pipeline_item_id,
      workspace_id: job.workspace_id,
      action: terminal ? "queue_dead_lettered" : "queue_retried",
      actor: workerId,
      details: { job_id: id, attempts: nextAttempts, error: errorMessage }
    });
  }

  // Pipeline Locking
  static async acquireLock(itemId: string, workspaceId: string, workerId: string, durationMin: number = 5) {
    const expiresAt = new Date(Date.now() + durationMin * 60000).toISOString();
    
    const { error: insertError } = await supabase
      .from("pipeline_locks")
      .insert([{ 
        pipeline_item_id: itemId, 
        workspace_id: workspaceId,
        worker_id: workerId, 
        expires_at: expiresAt 
      }]);
    
    if (!insertError) return true;

    const { data: updateData } = await supabase
      .from("pipeline_locks")
      .update({ worker_id: workerId, expires_at: expiresAt })
      .eq("pipeline_item_id", itemId)
      .lt("expires_at", new Date().toISOString())
      .select();

    return !!updateData && updateData.length > 0;
  }

  static async releaseLock(itemId: string, workerId: string) {
    await supabase
      .from("pipeline_locks")
      .delete()
      .eq("pipeline_item_id", itemId)
      .eq("worker_id", workerId);
  }

  // Watchdog Methods
  static async fetchStalledJobs(stalledBefore: string) {
    return await supabase
      .from("job_queue")
      .select("*")
      .eq("status", "processing")
      .lt("locked_at", stalledBefore);
  }

  static async clearExpiredLocks() {
    const now = new Date().toISOString();
    await supabase
      .from("pipeline_locks")
      .delete()
      .lt("expires_at", now);
  }

  // Memory Methods
  static async saveMemoryRecord(record: {
    workspace_id: string;
    category: string;
    pattern_key: string;
    pattern_data: unknown;
    performance_metrics?: unknown;
  }) {
    return await supabase
      .from("memory_records")
      .upsert([record], { onConflict: "workspace_id,category,pattern_key" });
  }

  static async getMemoryRecords(workspaceId: string, category: string) {
    const { data, error } = await supabase
      .from("memory_records")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("category", category)
      .order("updated_at", { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async releaseJobLock(pipelineItemId: string, workerId: string) {
    await supabase
      .from("job_queue")
      .update({ locked_at: null, locked_by: null })
      .eq("pipeline_item_id", pipelineItemId)
      .eq("locked_by", workerId);
  }

  static async extendJobLock(pipelineItemId: string, workerId: string) {
    const { error } = await supabase
      .from("job_queue")
      .update({ locked_at: new Date().toISOString() })
      .eq("pipeline_item_id", pipelineItemId)
      .eq("locked_by", workerId)
      .eq("status", "processing");
    
    return !error;
  }

  static async getQueueDepth(workspaceId: string) {
    const { count, error } = await supabase
      .from("job_queue")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "pending");
    
    if (error) throw error;
    return count || 0;
  }

  // Artifact & Lineage Methods
  static async createArtifact(artifact: {
    workspace_id: string;
    pipeline_item_id: string;
    agent_run_id?: string;
    parent_artifact_id?: string;
    type: string;
    data: unknown;
  }) {
    const { data, error } = await supabase
      .from("artifacts")
      .insert([artifact])
      .select()
      .single();
    
    if (error) throw error;

    await supabase
      .from("pipeline_items")
      .update({ last_artifact_id: data.id })
      .eq("id", artifact.pipeline_item_id);

    return data;
  }

  static async getArtifactLineage(pipelineItemId: string) {
    const { data, error } = await supabase
      .from("artifacts")
      .select("*")
      .eq("pipeline_item_id", pipelineItemId)
      .order("created_at", { ascending: true });
    
    if (error) throw error;
    return data;
  }

  static async recordArtifactFeedback(feedback: {
    artifact_id: string;
    score: number;
    metrics: unknown;
    provided_by: string;
    comments?: string;
  }) {
    const { data, error } = await supabase
      .from("artifact_feedback")
      .insert([feedback])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async recordPipelineEvent(event: {
    pipeline_item_id: string;
    workspace_id: string;
    event_type: string;
    from_state?: string | null;
    to_state?: string | null;
    artifact_id?: string | null;
    agent_run_id?: string | null;
    workflow_run_id?: string | null;
    node_run_id?: string | null;
    payload?: unknown;
    actor?: string | null;
  }) {
    const { data, error } = await supabase
      .from("pipeline_events")
      .insert([event])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getWorkspaceConfig(workspaceId: string) {
    try {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("workspaces")
        .select("metadata")
        .eq("id", workspaceId)
        .single();
      
      return data?.metadata || {};
    } catch {
      return {};
    }
  }

  static async getRecentEvents(eventType: string, limit: number = 100) {
    const { data, error } = await supabase
      .from("pipeline_events")
      .select("*")
      .eq("event_type", eventType)
      .order("created_at", { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  static async recordInsight(insight: {
    insight_type: string;
    target: string;
    value: unknown;
  }) {
    const { data, error } = await supabase
      .from("platform_insights")
      .insert([insight])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async persistSupervisionAlerts(alerts: {
    type: string;
    capability: string;
    message: string;
    metadata?: unknown;
  }[]) {
    const formattedAlerts = alerts.map(a => ({
        alert_type: a.type,
        target: a.capability,
        message: a.message,
        metadata: a.metadata
    }));

    const { data, error } = await supabase
      .from("supervision_alerts")
      .insert(formattedAlerts)
      .select();
    
    if (error) throw error;
    return data;
  }

  // Pack Ecosystem Methods (Phase 16)
  static async createVerticalPack(input: unknown) {
    const { data, error } = await supabase
      .from("vertical_packs")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createPackVersion(input: unknown) {
    const { data, error } = await supabase
      .from("pack_versions")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async linkPackCapability(packId: string, capabilityKey: string) {
    const { data, error } = await supabase
      .from("pack_capability_links")
      .insert([{ pack_id: packId, capability_key: capabilityKey }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getVerticalPackBySlug(slug: string) {
    const { data, error } = await supabase
      .from("vertical_packs")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) throw error;
    return data;
  }

  static async listVerticalPacks() {
    const { data, error } = await supabase
      .from("vertical_packs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async installWorkspacePack(input: unknown) {
    const { data, error } = await supabase
      .from("workspace_pack_installs")
      .upsert([input], { onConflict: "workspace_id,pack_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkspacePackInstall(workspaceId: string, packId: string, patch: unknown) {
    const { data, error } = await supabase
      .from("workspace_pack_installs")
      .update(patch)
      .eq("workspace_id", workspaceId)
      .eq("pack_id", packId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async checkPackVersionExists(packId: string, version: string) {
    const { data, error } = await supabase
      .from("pack_versions")
      .select("id")
      .eq("pack_id", packId)
      .eq("version", version)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  // Workforce Layer Methods (Phase 17)
  static async listActiveAgentsByRole(workspaceId: string, role: string) {
    const { data, error } = await supabase
      .from("agent_profiles")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("role", role)
      .eq("status", "active");

    if (error) throw error;
    return data || [];
  }

  static async createAgentAssignment(input: unknown) {
    const { data, error } = await supabase
      .from("agent_assignments")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createSubtask(input: unknown) {
    const { data, error } = await supabase
      .from("subtasks")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSubtask(subtaskId: string, patch: unknown) {
    const { data, error } = await supabase
      .from("subtasks")
      .update(patch)
      .eq("id", subtaskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAgentReputation(agentId: string) {
    const { data, error } = await supabase
      .from("agent_reputation_metrics")
      .select("*")
      .eq("agent_id", agentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async upsertAgentReputation(input: unknown) {
    const { data, error } = await supabase
      .from("agent_reputation_metrics")
      .upsert([input], { onConflict: "agent_id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async createHumanTask(input: unknown) {
    const { data, error } = await supabase
      .from("human_tasks")
      .insert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getWorkflowEvents(workflowId: string, afterEventId?: string) {
    let query = supabase
      .from("pipeline_events")
      .select("*")
      .eq("workflow_run_id", workflowId);
    
    if (afterEventId) {
        // In production, this would use a sequential ID or timestamp
        query = query.gt("id", afterEventId);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  static async upsertWorker(input: unknown) {
    const { data, error } = await supabase
      .from("worker_registry")
      .upsert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkerStatus(id: string, patch: unknown) {
    const { data, error } = await supabase
      .from("worker_registry")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async listWorkers(filters: unknown) {
    let query = supabase.from("worker_registry").select("*");
    if (filters.worker_type) query = query.eq("worker_type", filters.worker_type);
    if (filters.status) query = query.eq("status", filters.status);
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  static async updateWorkflowProjection(workflowId: string, state: unknown) {
    const { data, error } = await supabase
      .from("workflow_projections")
      .upsert([{ workflow_id: workflowId, state, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async markEventProjected(eventId: string) {
    const { data, error } = await supabase
      .from("pipeline_events")
      .update({ projection_updated: true })
      .eq("id", eventId);

    if (error) throw error;
    return data;
  }

  static async claimNodeRunLock(input: unknown) {
    const { data, error } = await supabase
      .from("node_run_locks")
      .upsert([input], { onConflict: "node_run_id" })
      .select()
      .single();

    if (error) throw error;
    return !!data;
  }

  static async renewNodeRunLock(nodeRunId: string, patch: unknown) {
    const { data, error } = await supabase
      .from("node_run_locks")
      .update(patch)
      .eq("node_run_id", nodeRunId)
      .select()
      .single();

    if (error) throw error;
    return !!data;
  }

  static async releaseNodeRunLock(nodeRunId: string) {
    const { error } = await supabase
      .from("node_run_locks")
      .delete()
      .eq("node_run_id", nodeRunId);

    if (error) throw error;
    return true;
  }

  static async updateControlState(patch: unknown) {
    const { data, error } = await supabase
      .from("control_plane_state")
      .upsert([{ id: "global", ...patch, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateWorkspaceControl(workspaceId: string, patch: unknown) {
    const { data, error } = await supabase
      .from("workspace_controls")
      .upsert([{ workspace_id: workspaceId, ...patch, updated_at: new Date().toISOString() }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async upsertAutonomyProfile(input: unknown) {
    const { data, error } = await supabase
      .from("autonomy_profiles")
      .upsert([input])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateSafetyMode(workspaceId: string, patch: unknown) {
    const { data, error } = await supabase
      .from("safety_mode_state")
      .upsert([{ id: workspaceId, ...patch }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async checkPackApproval(packSlug: string, version: string) {
    // In production, this queries 'pack_approval_requests'
    return true; // Mocked approval for testing
  }

  static async upsertPackInstall(workspaceId: string, packSlug: string, version: string) {
    const { data, error } = await supabase
      .from("workspace_pack_installs")
      .upsert([{ 
        workspace_id: workspaceId, 
        pack_slug: packSlug, // corrected field name if needed
        version, 
        status: "enabled",
        updated_at: new Date().toISOString() 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async getWorkflowInsights(workflowId: string) {
    // Mocked insights
    return [
      { type: "latency", node_id: "node-render", value: 18500 }
    ];
  }

  static async upsertEvolutionProposal(proposal: unknown) {
    const { data, error } = await supabase
      .from("workflow_evolution_proposals")
      .upsert([proposal])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async upsertPolicyBundle(bundle: unknown) {
    const { data, error } = await supabase
      .from("policy_bundles")
      .upsert([bundle])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getPolicyBundle(id: string) {
    const { data, error } = await supabase
      .from("policy_bundles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  static async upsertSnapshot(snapshot: unknown) {
    const { data, error } = await supabase
      .from("workflow_snapshots")
      .upsert([snapshot])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getLatestSnapshotByType(workflowRunId: string, type: string) {
    const { data, error } = await supabase
      .from("workflow_snapshots")
      .select("*")
      .eq("workflow_run_id", workflowRunId)
      .eq("snapshot_type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  }
}
