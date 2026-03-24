import type { AgentRole } from './agent.registry';
import { ContextRetrievalService } from './context-retrieval.service';
import { KnowledgeExtractionService } from './knowledge-extraction.service';

export type TaskStatus = 'Queued' | 'Assigned' | 'Running' | 'HandoffPending' | 'Completed' | 'Failed' | 'Escalated' | 'Canceled';

export interface AgentTask {
  id: string;
  planId: string;
  assignedRole: AgentRole;
  assignedAgentId?: string;
  status: TaskStatus;
  payload: unknown;
  result?: unknown;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export class TaskDelegationService {
  private static taskStore: Map<string, AgentTask> = new Map();

  static async createTask(planId: string, role: AgentRole, payload: unknown): Promise<AgentTask> {
    const task: AgentTask = {
      id: `task_${Math.random().toString(36).substr(2, 9)}`,
      planId,
      assignedRole: role,
      status: 'Queued',
      payload: { ...payload }
    };

    // PHASE 71 INTEGRATION: Context Retrieval
    console.log(`[TaskDelegation] Phase 71 Context Retrieval triggered for task ${task.id}`);
    const context = await ContextRetrievalService.retrieveRelevantContext(
        payload.workspaceId || 'default',
        payload.objective || 'General Task',
        'system' // In production, this would be the agent's ID if known
    );
    
    // Inject memory context into payload
    if (context.length > 0) {
        task.payload.memoryContext = context.map(m => m.fact);
        console.log(`[TaskDelegation] Injected ${context.length} memory fragments into task ${task.id}`);
    }

    this.taskStore.set(task.id, task);
    return task;
  }

  static async updateTaskStatus(taskId: string, status: TaskStatus, result?: unknown, error?: string) {
    const task = this.taskStore.get(taskId);
    if (task) {
      task.status = status;
      if (result) task.result = result;
      if (error) task.error = error;
      if (status === 'Running') task.startTime = Date.now();
      
      if (status === 'Completed') {
          task.endTime = Date.now();
          // PHASE 71 INTEGRATION: Knowledge Extraction
          console.log(`[TaskDelegation] Phase 71 Knowledge Extraction triggered for task ${taskId}`);
          await KnowledgeExtractionService.extractFromTask(taskId);
      }
      
      if (status === 'Failed') task.endTime = Date.now();
      console.log(`[TaskDelegation] Task ${taskId} -> ${status}`);
    }
  }

  static getTasksByPlan(planId: string): AgentTask[] {
    return Array.from(this.taskStore.values()).filter(t => t.planId === planId);
  }

  static getTask(id: string): AgentTask | undefined {
    return this.taskStore.get(id);
  }
}



const type_stub = (props: any) => null;
export default type_stub;
