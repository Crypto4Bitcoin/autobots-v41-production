import { supabase } from "./supabase-service";
import { CapabilityRegistryService } from "./capability-registry-service";

export class WorkflowBuilderService {
  /**
   * Applies an edit to a draft workflow proposal and persists a new version.
   */
  async applyEdit(proposalId: string, edit: { type: string; node?: unknown; edge?: unknown }) {
    console.log(`[WorkflowBuilder] Applying edit (${edit.type}) to proposal ${proposalId}`);

    // 1. Fetch current proposal draft
    const { data: proposal } = await supabase
      .from("workflow_proposals")
      .select("draft_definition, workspace_id")
      .eq("id", proposalId)
      .single();

    if (!proposal) throw new Error("Proposal not found");
    const dag = proposal.draft_definition;

    // 2. Perform Edit
    if (edit.type === "add_node" && edit.node) {
      if (!CapabilityRegistryService.getCapability(edit.node.capability)) {
        throw new Error(`Invalid capability: ${edit.node.capability}`);
      }
      dag.nodes.push(edit.node);
    } 
    else if (edit.type === "add_edge" && edit.edge) {
      dag.edges.push(edit.edge);
    }

    // 3. Validate DAG (Structural & Governance)
    WorkflowBuilderService.validate(dag);

    // 4. Persist Version (Phase 14)
    await supabase.from("workflow_proposal_versions").insert([{
        proposal_id: proposalId,
        draft_dag: dag,
        version: Date.now() // Mocking version increment
    }]);

    // 5. Update main proposal
    await supabase.from("workflow_proposals").update({
        draft_definition: dag
    }).eq("id", proposalId);

    return true;
  }

  static validate(dag: unknown) {
    this.ensureNoCycles(dag);
    this.ensureAllNodesReachable(dag);
  }

  static ensureNoCycles(dag: unknown) {
    const visited = new Set();
    const stack = new Set();

    const visit = (nodeId: string) => {
      if (stack.has(nodeId)) {
        throw new Error(`Cycle detected in DAG at node: ${nodeId}`);
      }
      if (visited.has(nodeId)) return;

      stack.add(nodeId);

      dag.edges
        .filter((e: unknown) => e.from === nodeId)
        .forEach((e: unknown) => visit(e.to));

      stack.delete(nodeId);
      visited.add(nodeId);
    };

    dag.nodes.forEach((n: unknown) => visit(n.id));
  }

  static ensureAllNodesReachable(dag: unknown) {
    if (dag.nodes.length === 0) return;
    
    // Root nodes are those with no incoming edges
    const roots = dag.nodes.filter(
      (n: unknown) => !dag.edges.some((e: unknown) => e.to === n.id)
    );

    if (roots.length === 0) {
      throw new Error("Workflow must contain at least one root node (no incoming edges)");
    }
  }
}
