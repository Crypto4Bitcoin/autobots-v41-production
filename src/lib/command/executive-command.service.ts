import { IntentParsingEngine } from './intent-parsing.engine';
import { ConversationalTaskPlanner } from './conversational-task-planner';

export class ExecutiveCommandService {
  /**
   * Processes natural language instructions and executes the resulting plan.
   */
  static async processCommand(instruction: string, workspaceId: string) {
    console.log(`[ExecutiveCommand] Processing: "${instruction}"`);
    
    // 1. Parse Intent
    const intent = IntentParsingEngine.parse(instruction);

    // 2. Plan Workforce Actions
    const tasks = await ConversationalTaskPlanner.planForIntent(intent, workspaceId);

    console.log(`[ExecutiveCommand] Dispatching ${tasks.length} tasks for intent: ${intent.action}`);
    // Tasks are handled via TaskDelegationService in reality
    return { intent, tasks };
  }
}
