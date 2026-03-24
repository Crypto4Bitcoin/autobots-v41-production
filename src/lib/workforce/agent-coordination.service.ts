import { AgentRegistry } from './agent.registry';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AgentRole } from './agent.registry';
import { TaskDelegationService } from './task-delegation.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AgentTask } from './task-delegation.service';

export class AgentCoordinationService {
  /**
   * Assigns a task to the best available agent for the role.
   */
  static async assignTask(taskId: string) {
    const task = TaskDelegationService.getTask(taskId);
    if (!task) return;

    const availableAgents = AgentRegistry.getAgentsByRole(task.assignedRole).filter(a => a.status === 'Healthy');
    
    if (availableAgents.length === 0) {
      console.warn(`[AgentCoordination] No healthy ${task.assignedRole} agents available for task ${taskId}`);
      await TaskDelegationService.updateTaskStatus(taskId, 'Failed', null, 'No available agents for role.');
      return;
    }

    // Simple round-robin or first-available selection
    const agent = availableAgents[0];
    task.assignedAgentId = agent.id;
    await TaskDelegationService.updateTaskStatus(taskId, 'Assigned');
    
    console.log(`[AgentCoordination] Task ${taskId} assigned to agent ${agent.id}`);
    
    // Trigger agent execution logic (simulated for now)
    this.executeTask(taskId);
  }

  private static async executeTask(taskId: string) {
    await TaskDelegationService.updateTaskStatus(taskId, 'Running');
    // Simulate agent processing...
  }
}




