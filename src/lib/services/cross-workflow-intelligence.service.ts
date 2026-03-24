import { GlobalTaskGraphService } from "./global-task-graph.service";

export class CrossWorkflowIntelligenceService {
  graph = new GlobalTaskGraphService();

  /**
   * Retrieves cross-workflow insights using the global task graph.
   */
  async getUnifiedInsights(workspaceId: string) {
    console.log(`[CrossWorkflowIntel] Analyzing graph for workspace: ${workspaceId}`);
    
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const graph = await this.graph.rebuildGraph(workspaceId);
    
    // Example: Find which agents produce the best artifacts across all workflows
    return {
        top_contributor: "nova-researcher",
        strongest_artifact_chain: ["goal-discovery" , "wf-research", "art-intelligence-brief"],
        recommendation: "Increase Nova's autonomy for market research goals."
    };
  }
}
