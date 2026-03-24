import { TaskDelegationService } from './task-delegation.service';
import { InterAgentMessagingService } from './inter-agent-messaging.service';

export class ConflictResolutionService {
  /**
   * Handles situations where multiple agents disagree on conclusions or confidence.
   */
  static async resolveConflict(taskId: string, agentInsights: unknown[]) {
    console.log(`[ConflictResolution] Evaluating disagreement for task ${taskId}`);
    
    // Logic:
    // 1. Check if disagreement exceeds threshold
    // 2. Identify outlier conclusions
    // 3. Option A: Escalate to StrategyAgent
    // 4. Option B: Request Human-in-the-loop
    
    console.log(`[ConflictResolution] Conflict detected. Escalating to StrategyAgent.`);
    await TaskDelegationService.updateTaskStatus(taskId, 'Escalated', null, 'Unresolved agent disagreement.');
    
    await InterAgentMessagingService.send({
      senderId: 'ConflictResolutionService',
      recipientRole: 'Strategy',
      subject: 'Conflict Escalation',
      payload: { taskId, agentInsights },
      correlationId: taskId
    });
  }
}


