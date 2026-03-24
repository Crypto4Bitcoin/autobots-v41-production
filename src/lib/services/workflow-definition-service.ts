import { supabase } from "./supabase-service";

export class WorkflowDefinitionService {
    /**
     * Initializes a workflow run from a definition.
     * Creates node runs for ALL nodes in the definition, marking root nodes as 'runnable'.
     */
    static async initializeRun(definitionSlug: string, pipelineItemId: string, workspaceId: string) {
        // 1. Load definition and nodes
        const { data: def, error: defErr } = await supabase
            .from("workflow_definitions")
            .select("id, workflow_nodes(*)")
            .eq("slug", definitionSlug)
            .single();

        if (defErr) throw defErr;

        // 2. Create Workflow Run
        const { data: run, error: runErr } = await supabase
            .from("workflow_runs")
            .insert([{
                workflow_definition_id: def.id,
                pipeline_item_id: pipelineItemId,
                workspace_id: workspaceId,
                status: "running",
                started_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (runErr) throw runErr;

        // 3. Create Node Runs
        const nodes = def.workflow_nodes;
        
        // Find orphans/roots (no incoming edges)
        const { data: edges } = await supabase
            .from("workflow_edges")
            .select("to_node_id")
            .eq("workflow_definition_id", def.id);

        const targetNodeIds = new Set(edges?.map(e => e.to_node_id) || []);
        
        const nodeRuns = nodes.map((n: unknown) => ({
            workflow_run_id: run.id,
            workflow_node_id: n.id,
            pipeline_item_id: pipelineItemId,
            workspace_id: workspaceId,
            status: targetNodeIds.has(n.id) ? "pending" : "runnable", // Roots are runnable
            max_attempts: n.retry_policy?.max_attempts || 3
        }));

        const { error: nodeRunErr } = await supabase
            .from("node_runs")
            .insert(nodeRuns);

        if (nodeRunErr) throw nodeRunErr;

        return run;
    }

    /**
     * Basic cycle detection using DFS.
     */
    static async validateDAG(definitionId: string): Promise<boolean> {
        const { data: edges } = await supabase
            .from("workflow_edges")
            .select("from_node_id, to_node_id")
            .eq("workflow_definition_id", definitionId);

        if (!edges || edges.length === 0) return true;

        const adj = new Map<string, string[]>();
        for (const edge of edges) {
            if (!adj.has(edge.from_node_id)) adj.set(edge.from_node_id, []);
            adj.get(edge.from_node_id)!.push(edge.to_node_id);
        }

        const visited = new Set<string>();
        const recStack = new Set<string>();

        const hasCycle = (v: string): boolean => {
            if (recStack.has(v)) return true;
            if (visited.has(v)) return false;

            visited.add(v);
            recStack.add(v);

            for (const neighbor of (adj.get(v) || [])) {
                if (hasCycle(neighbor)) return true;
            }

            recStack.delete(v);
            return false;
        };

        for (const [nodeId] of adj) {
            if (hasCycle(nodeId)) return false;
        }

        return true;
    }
}
