import { AgentMemoryStore } from './agent-memory.store';
import type { MemoryFragment } from './agent-memory.store';
import { MemoryRelevanceEngine } from './memory-relevance.engine';

export class ContextRetrievalService {
  /**
   * Automatically searches AgentMemoryStore when a new task is Queued.
   */
  static async retrieveRelevantContext(workspaceId: string, taskObjective: string, agentId: string): Promise<MemoryFragment[]> {
    console.log(`[ContextRetrieval] Searching memory for task: ${taskObjective} [Agent: ${agentId}]`);

    // 1. Initial Retrieval (Broad search)
    const candidates = await AgentMemoryStore.retrieve(workspaceId, taskObjective, agentId);

    // 2. Relevance Scoring & Filtering
    const relevantFragments = MemoryRelevanceEngine.scoreAndFilter(candidates, taskObjective);
    
    console.log(`[ContextRetrieval] Found ${relevantFragments.length} relevant memory fragments for injection.`);
    return relevantFragments;
  }
}
