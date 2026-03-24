export class WorkflowProposalViewer {
  /**
   * Generates a visual ASCII representation of a draft DAG for operator inspection.
   */
  static projectVisual(draftDag: { nodes: unknown[], edges: unknown[] }): string {
    let output = "\n--- 🗺️ Workflow Proposal Visualizer ---\n";
    
    if (draftDag.nodes.length === 0) return "Empty DAG Proposal.";

    draftDag.nodes.forEach((node, index) => {
      const isLast = index === draftDag.nodes.length - 1;
      const statusIcon = node.status === "draft" ? "📝" : "✅";
      
      output += `  ${statusIcon} [${node.id}] (${node.capability_key || node.capability})\n`;
      
      if (!isLast) {
        output += "      ↓\n";
      }
    });

    output += "----------------------------------------\n";
    output += "💡 Status: PENDING OPERATOR REVIEW\n";
    
    return output;
  }

  /**
   * Renders a clean JSON structure for visual DAG editors.
   */
  static render(dag: unknown) {
    return {
      nodes: dag.nodes.map((n: unknown) => ({
        id: n.id,
        label: n.capability_key || n.capability,
        type: n.type || "agent"
      })),
      edges: dag.edges.map((e: unknown) => ({
        from: e.from,
        to: e.to
      }))
    };
  }
}
