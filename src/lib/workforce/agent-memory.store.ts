import { InstitutionalGuard } from './institutional-guard';
import { MemoryAuditService } from './memory-audit.service';
import { MemoryScopeGuard } from './memory-scope-guard';
import { MemoryLifecycleService } from './memory-lifecycle.service';
import type { RetentionClass } from './memory-lifecycle.service';

export type MemoryClass = 'Ephemeral' | 'Workspace' | 'Institutional';
export type MemoryState = 'Draft' | 'Active' | 'Archived' | 'Expired' | 'Redacted' | 'DeletedByPolicy';

export interface MemoryFragment {
  id: string;
  workspaceId: string;
  agentId: string;
  class: MemoryClass;
  state: MemoryState;
  fact: string;
  metadata: unknown;
  trustScore: number;
  timestamp: number;
  expiresAt?: number;
}

export class AgentMemoryStore {
  private static memories: Map<string, MemoryFragment[]> = new Map();

  static async store(fragmentData: Omit<MemoryFragment, 'id' | 'timestamp' | 'trustScore' | 'expiresAt' | 'state'>, retention: RetentionClass): Promise<MemoryFragment> {
    const expiresAt = MemoryLifecycleService.getExpiryDate(retention);
    const fullFragment: MemoryFragment = {
      ...fragmentData,
      id: `mem_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      trustScore: 0.5,
      expiresAt,
      state: 'Active'
    };

    const workspaceMemories = this.memories.get(fragmentData.workspaceId) || [];
    workspaceMemories.push(fullFragment);
    this.memories.set(fragmentData.workspaceId, workspaceMemories);
    
    MemoryAuditService.log({
        workspaceId: fullFragment.workspaceId,
        agentId: fullFragment.agentId,
        action: 'creation',
        fragmentId: fullFragment.id,
        policyApplied: ['RetentionCheck', 'IsolationCheck']
    });

    return fullFragment;
  }

  static async retrieve(workspaceId: string, query: string, agentId: string): Promise<MemoryFragment[]> {
    if (!InstitutionalGuard.canAccess(workspaceId, agentId)) {
      throw new Error(`Unauthorized memory access attempt for workspace ${workspaceId}`);
    }

    const workspaceMemories = this.memories.get(workspaceId) || [];
    const activeMemories = workspaceMemories.filter(m => m.state === 'Active');
    const allowedMemories: MemoryFragment[] = [];
    const queryKeywords = query.toLowerCase().split(' ').filter(k => k.length > 2);

    for (const mem of activeMemories) {
        const canRead = await MemoryScopeGuard.validateAccess(agentId, mem.id);
        if (canRead) {
            const factLower = mem.fact.toLowerCase();
            const hasMatch = queryKeywords.length === 0 || queryKeywords.some(kw => factLower.includes(kw));
            if (hasMatch) allowedMemories.push(mem);
        }
    }

    MemoryAuditService.log({
        workspaceId,
        agentId,
        action: 'retrieval',
        policyApplied: ['InstitutionalGuard', 'ScopeGuard'],
        influence: `Retrieved ${allowedMemories.length} fragments.`
    });

    return allowedMemories;
  }

  static async updateTrust(memoryId: string, workspaceId: string, delta: number) {
      const workspaceMemories = this.memories.get(workspaceId) || [];
      const fragment = workspaceMemories.find(m => m.id === memoryId);
      if (fragment) {
          fragment.trustScore = Math.max(0, Math.min(1, fragment.trustScore + delta));
          MemoryAuditService.log({
              workspaceId,
              agentId: 'System_Feedback_Loop',
              action: 'update',
              fragmentId: memoryId,
              policyApplied: ['OutcomeReview']
          });
      }
  }
}

const type_stub = (props: any) => null;
export default type_stub;
