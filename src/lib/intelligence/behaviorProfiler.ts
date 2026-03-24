import { AgentTrait } from './personalityRegistry';
export interface BehaviorLog {
  timestamp: number;
  agentId: string;
  trait: AgentTrait;
  action: string;
  result: 'SUCCESS' | 'FAILURE' | 'ERROR';
  confidence: number;
}
export class BehaviorProfiler {
  private static logs: BehaviorLog[] = [];
  static addLog(agentId: string, trait: AgentTrait, action: string, result: 'SUCCESS' | 'FAILURE' | 'ERROR', confidence: number): void {
    const log: BehaviorLog = { timestamp: Date.now(), agentId, trait, action, result, confidence };
    this.logs.push(log);
    if (this.logs.length > 1000) this.logs.shift();
  }
  static getAgentProfile(agentId: string): BehaviorLog[] {
    return this.logs.filter(log => log.agentId === agentId);
  }
}
