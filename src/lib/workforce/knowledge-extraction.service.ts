import { AgentMemoryStore } from './agent-memory.store';
import type { MemoryClass } from './agent-memory.store';
import { KnowledgeValidationService } from './knowledge-validation.service';
import { TaskDelegationService } from './task-delegation.service';
import type { AgentTask } from './task-delegation.service';

export class KnowledgeExtractionService {
  /**
   * Post-task analysis that extracts reusable intelligence from completed tasks.
   */
  static async extractFromTask(taskId: string) {
    const task = TaskDelegationService.getTask(taskId);
    if (!task || task.status !== 'Completed') return;

    console.log(`[KnowledgeExtraction] Distilling intelligence from task ${taskId} [${task.assignedRole}]`);

    // In production, this uses an LLM to parse task.result and task.payload
    const discoveries = this.simulateDiscovery(task);

    for (const discovery of discoveries) {
        const isValid = KnowledgeValidationService.validate(discovery);
        if (isValid) {
            await AgentMemoryStore.store({
                workspaceId: task.payload.workspaceId || 'default',
                agentId: task.assignedAgentId || 'unknown',
                class: this.determineClass(task),
                fact: discovery.fact,
                metadata: discovery.metadata,
            }, discovery.retention || 'Operational');
        }
    }
  }

  private static simulateDiscovery(task: AgentTask): unknown[] {
      // Mock logic simulating extracting specific facts from results
      if (task.assignedRole === 'Research') {
          return [{
              fact: `Verified competitor data for target: ${task.payload.target}. Market share detected at ${task.result?.marketShare || 'high'}.`,
              metadata: { source: 'research_discovery', confidence: 0.92 },
              retention: 'Institutional'
          }];
      }
      return [];
  }

  private static determineClass(task: AgentTask): MemoryClass {
      if (task.assignedRole === 'Research' || task.assignedRole === 'Analysis') return 'Workspace';
      if (task.assignedRole === 'Strategy') return 'Institutional';
      return 'Ephemeral';
  }
}

