import type { ParsedIntent } from './intent-parsing.engine';

export class ConversationalTaskPlanner {
  /**
   * Translates Intents into executable AgentTask chains.
   */
  static async planForIntent(intent: ParsedIntent, workspaceId: string): Promise<unknown[]> {
    console.log(`[ConversationalTaskPlanner] Architecting task chain for intent: ${intent.action}`);
    
    switch (intent.action) {
      case 'Research':
        return [
          { role: 'Research', action: `Secondary market research on ${intent.target}`, workspaceId },
          { role: 'Analysis', action: `Risk synthesis for ${intent.target}`, workspaceId }
        ];
      case 'Simulation':
        return [
          { role: 'Research', action: `Data gathering for simulation: ${intent.target}`, workspaceId },
          { role: 'Strategy', action: `Run scenario simulation for ${intent.target}`, workspaceId }
        ];
      default:
        return [
          { role: 'Monitoring', action: `Search for context on ${intent.target}`, workspaceId }
        ];
    }
  }
}
