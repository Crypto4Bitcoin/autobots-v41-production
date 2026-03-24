import { DBService, supabase } from "./supabase-service";

export interface NodeStatus {
    id: string;
    nodeKey: string;
    status: "pending" | "runnable" | "processing" | "completed" | "failed" | "skipped";
}

export class WorkflowEngine {
    /**
     * Unblocks downstream nodes if all their parents are satisfied.
     */
    static async checkDownstreamDependencies(nodeRunId: string) {
        // 1. Get the node run to find the node_id and workflow_run_id
        const { data: currentRun, error: runErr } = await supabase
            .from("node_runs")
            .select("workflow_run_id, workflow_node_id")
            .eq("id", nodeRunId)
            .single();

        if (runErr || !currentRun) return;

        // 2. Find children of this node
        const { data: edges, error: edgeErr } = await supabase
            .from("workflow_edges")
            .select("to_node_id")
            .eq("from_node_id", currentRun.workflow_node_id);

        if (edgeErr || !edges) return;

        for (const edge of edges) {
            const childNodeId = edge.to_node_id;

            // 3. For each child, check if ALL parents are completed/skipped in this workflow run
            const { data: parents, error: parentErr } = await supabase
                .from("workflow_edges")
                .select("from_node_id")
                .eq("to_node_id", childNodeId);

            if (parentErr || !parents) continue;

            const parentNodeIds = parents.map(p => p.from_node_id);

            const { data: parentRuns, error: parentRunErr } = await supabase
                .from("node_runs")
                .select("status")
                .eq("workflow_run_id", currentRun.workflow_run_id)
                .in("workflow_node_id", parentNodeIds);

            if (parentRunErr) continue;

            const allSatisfied = parentRuns.every(r => r.status === "completed" || r.status === "skipped");
            const anyFailed = parentRuns.some(r => r.status === "failed"); // Simplification: fail branch if parent fails

            if (allSatisfied && !anyFailed) {
                // 4. Mark child as 'runnable'
                await supabase
                    .from("node_runs")
                    .update({ status: "runnable" })
                    .eq("workflow_run_id", currentRun.workflow_run_id)
                    .eq("workflow_node_id", childNodeId)
                    .eq("status", "pending");
            }
        }
    }

    static async completeNode(nodeRunId: string, status: "completed" | "failed" | "skipped") {
        await DBService.updateNodeRunStatus(nodeRunId, status);
        
        if (status === "completed" || status === "skipped") {
            await this.checkDownstreamDependencies(nodeRunId);
        }
    }

    /**
     * Reconstructs workflow progress projection.
     */
    static async projectWorkflowStatus(workflowRunId: string) {
        const { data: runs, error } = await supabase
            .from("node_runs")
            .select("status")
            .eq("workflow_run_id", workflowRunId);

        if (error) return;

        const total = runs.length;
        const completed = runs.filter(r => r.status === "completed" || r.status === "skipped").length;
        const failed = runs.filter(r => r.status === "failed").length;

        let workflowStatus = "running";
        if (completed === total) workflowStatus = "completed";
        else if (failed > 0) workflowStatus = "failed"; // simplistic

        await supabase
            .from("workflow_runs")
            .update({ 
                status: workflowStatus,
                current_projection: {
                    completed_count: completed,
                    total_count: total,
                    failed_count: failed,
                    progress_percent: Math.round((completed / total) * 100)
                }
            })
            .eq("id", workflowRunId);
    }
}
