import { AssemblyProposal } from "../types/assembly-types";
import { CapabilityRegistryService } from "./capability-registry-service";
import { RecommendationFeedbackService } from "./recommendation-feedback-service";

export class WorkflowAssemblerService {
  /**
   * Assembles a custom draft DAG based on a set of capabilities or a prompt.
   * Enforces structural integrity and governance rules.
   */
  static async assembleDraft(capabilityKeys: string[], explanation: string, workspaceId: string = "default", userId: string = "system"): Promise<AssemblyProposal> {
    console.log(`[WorkflowAssembler] Assembling draft from keys: ${capabilityKeys.join(', ')}`);

    const draftDag: unknown = { nodes: [], edges: [] };
    const warnings: string[] = [];
    let isGoverned = true;

    // 1. Capability Validation
    for (const key of capabilityKeys) {
      const exists = CapabilityRegistryService.getCapability(key);
      if (!exists) {
        warnings.push(`Capability not found: ${key}. Will be treated as an external mock.`);
        isGoverned = false; 
      }
      
      const nodeId = `node-${key.replace('.', '-')}-${Math.floor(Math.random() * 1000)}`;
      draftDag.nodes.push({
        id: nodeId,
        capability_key: key,
        status: "draft"
      });
    }

    // 2. Linear Chaining Pattern (Default Heuristic)
    if (draftDag.nodes.length > 1) {
      for (let i = 0; i < draftDag.nodes.length - 1; i++) {
        draftDag.edges.push({
          from_node_id: draftDag.nodes[i].id,
          to_node_id: draftDag.nodes[i+1].id
        });
      }
    }

    // 3. Structural Integrity (Cycle Detection Mock)
    const hasCycle = false; // Simplified for Phase 12 demo
    if (hasCycle) {
      warnings.push("Detected potential circular dependency in assembled DAG.");
    }

    // 4. Persistence (Phase 13)
    await RecommendationFeedbackService.createProposal({
        workspaceId,
        proposedBy: userId,
        goalPrompt: explanation,
        draftDefinition: draftDag
    });

    return {
      draftDag,
      explanation: `${explanation}. (Assembled into a linear sequence of ${draftDag.nodes.length} nodes).`,
      warnings,
      isGoverned
    };
  }
}
