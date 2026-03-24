import { AgentMemoryStore } from './agent-memory.store';

export class OutcomeRefinementService {
  static async processOutcome(memoryId: string, workspaceId: string, result: 'success' | 'failure' | 'engagement_high' | 'engagement_low') {
    let delta = 0;
    if (result === 'success') delta = 0.1;
    else if (result === 'engagement_high') delta = 0.2;
    else if (result === 'failure') delta = -0.2;
    else if (result === 'engagement_low') delta = -0.1;
    await AgentMemoryStore.updateTrust(memoryId, workspaceId, delta);
  }
}
