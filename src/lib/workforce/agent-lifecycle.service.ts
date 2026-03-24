import { AgentRegistry } from './agent.registry';
import { MonitoringAgent } from './agents/monitoring.agent';
import { ResearchAgent } from './agents/research.agent';
import { AnalysisAgent } from './agents/analysis.agent';
import { WritingAgent } from './agents/writing.agent';
import { PublishingAgent } from './agents/publishing.agent';
import { StrategyAgent } from './agents/strategy.agent';

export class AgentLifecycleService {
  /**
   * Manager for operational state transitions for agents.
   */
  static async bootWorkforce() {
    console.log('[AgentLifecycle] Booting digital workforce...');
    
    // Initialize all roles
    MonitoringAgent.init();
    ResearchAgent.init();
    AnalysisAgent.init();
    WritingAgent.init();
    PublishingAgent.init();
    StrategyAgent.init();
    
    console.log('[AgentLifecycle] Workforce initialized and ready.');
  }

  static async setAgentHealth(id: string, status: unknown) {
    AgentRegistry.updateStatus(id, status);
  }

  static async pauseWorkforce() {
      console.log('[AgentLifecycle] Global workforce paused.');
      AgentRegistry.getAllAgents().forEach(a => AgentRegistry.updateStatus(a.id, 'Paused'));
  }
}


