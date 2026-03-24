import { supabase } from "../../lib/services/supabase-service";

/**
 * Creates a robust, fluent Supabase mock that handles common chained queries.
 */
export function setupSupabaseMock(overrides: Record<string, unknown[]> = {}) {
  const defaultNodes = [{ id: "n1", status: "completed" }];
  const defaultEdges = [{ from_node_id: "n1", to_node_id: "n2" }];
  const defaultWorkspaces = [{ id: "ws-1", max_monthly_budget_usd: 100, current_monthly_spend_usd: 0 }];

  function createChain(initialData: unknown) {
    let currentData = initialData;
    const chain: unknown = {
      select: function() { return this; },
      insert: function(d: unknown) { currentData = d; return this; },
      update: function(d: unknown) { 
        if (typeof d === 'object' && !Array.isArray(d)) {
            currentData = { ...currentData, ...d };
        } else {
            currentData = d;
        }
        return this; 
      },
      upsert: function(d: unknown) { 
        if (Array.isArray(d)) {
            currentData = { ...currentData, ...d[0] };
        } else {
            currentData = d;
        }
        return this; 
      },
      delete: function() { return this; },
      eq: function(field: string, val: unknown) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.filter(item => item[field] === val);
        }
        return this; 
      },
      gt: function(field: string, val: unknown) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.filter(item => item[field] > val);
        }
        return this; 
      },
      gte: function(field: string, val: unknown) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.filter(item => item[field] >= val);
        }
        return this; 
      },
      lt: function(field: string, val: unknown) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.filter(item => item[field] < val);
        }
        return this; 
      },
      lte: function(field: string, val: unknown) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.filter(item => item[field] <= val);
        }
        return this; 
      },
      order: function() { return this; },
      limit: function(n: number) { 
        if (Array.isArray(currentData)) {
            currentData = currentData.slice(0, n);
        }
        return this; 
      },
      single: function() { 
        const data = Array.isArray(currentData) ? (currentData.length > 0 ? currentData[0] : null) : currentData;
        return Promise.resolve({ 
          data, 
          error: null 
        }); 
      },
      maybeSingle: function() {
        return Promise.resolve({
          data: Array.isArray(currentData) ? (currentData.length > 0 ? currentData[0] : null) : currentData,
          error: null
        });
      },
      then: function(resolve: unknown) {
        return Promise.resolve(resolve({ data: Array.isArray(currentData) ? currentData : [currentData], error: null }));
      }
    };
    return chain;
  }

  const mockFrom = (table: string) => {
    const defaultData = (table === "node_runs" ? defaultNodes : (table === "edges" ? defaultEdges : (table === "workspaces" ? defaultWorkspaces : [])));
    const data = overrides[table] || defaultData;
    
    if (table === "artifacts") return createChain({ id: "mock-id-123" });
    if (table === "human_tasks") return createChain({ id: "mock-task-123", node_run_id: "node-1", workflow_run_id: "wf-1" });
    if (table === "workflow_proposals" && !overrides[table]) return createChain({ id: "prop-123", status: "pending" });
    if (table === "platform_insights") return createChain({ id: "insight-123" });
    if (table === "supervision_alerts") return createChain({ id: "alert-123" });
    if (table === "vertical_packs") return createChain({ id: "pack-123", slug: "research-pack", current_version: "1.0.0" });
    if (table === "pack_versions") return createChain({ id: "ver-123" });
    if (table === "workspace_pack_installs") return createChain({ id: "inst-123", status: "enabled", version: "1.0.0" });
    if (table === "agent_profiles") return createChain({ id: "agent-123", name: "Nova Research", role: "researcher", status: "active", workspace_id: "ws-test-123" });
    if (table === "agent_assignments") return createChain({ id: "ass-123" });
    if (table === "subtasks") return createChain({ id: "sub-123", status: "pending" });
    if (table === "agent_reputation_metrics") return createChain({ agent_id: "agent-123", success_rate: 0.9, avg_latency_ms: 3000, total_runs: 10, avg_review_score: 85, escalation_rate: 0.1, cost_efficiency: 0.8 });
    if (table === "human_tasks") return createChain({ id: "mock-task-123", status: "pending" });
    if (table === "worker_registry") return createChain({ id: "w-123", status: "online" });
    if (table === "node_run_locks") return createChain({ node_run_id: "node-1", worker_id: "w-123" });
    if (table === "workflow_projections") return createChain({ workflow_id: "wf-123", state: {} });
    if (table === "control_plane_state") return createChain({ id: "global", global_status: "active" });
    if (table === "autonomic_actions" || table === "mirror_results") return createChain([]);
    if (table === "marketplace_packs" || table === "usage_records") return createChain([]);
    if (table === "workspace_controls") return createChain({ 
        workspace_id: "ws-123", 
        status: "active", 
        concurrency_limit: 50,
        budget_limit: 1000,
        budget_alert_threshold: 0.8,
        provisioning_status: "completed",
        provisioning_error: null,
        provisioning_started_at: new Date().toISOString(),
        provisioning_completed_at: new Date().toISOString()
    });
    if (table === "cost_records") return createChain([]);
    if (table === "policy_bundles") return createChain({ id: "pb-mock-123", workspace_id: "ws-1" });
    if (table === "cluster_nodes") return createChain({ id: "node-1", status: "active", region: "us-east" });
    if (table === "infrastructure_events" || table === "platform_traces") return createChain([]);
    if (table === "platform_secrets") return createChain({ encrypted_value: "mock-secret-val" });
    if (table === "runtime_configs") return createChain({ version: "2.1.0", values: { max_concurrency: 50 } });
    if (table === "workflow_snapshots") {
        const snapshots = overrides[table] || [{ 
            id: "snap-1", 
            workflow_run_id: "wf-1", 
            snapshot_type: "workflow",
            source_stream_range: { start_id: "ev-0", end_id: "ev-1" },
            state_data: { status: "running", nodesCompleted: [] } 
        }];
        return createChain(snapshots);
    }
    
    return createChain(data);
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = mockFrom;
  return {};
}
