export type AgentHealthState = 'Healthy' | 'Degraded' | 'Paused' | 'Failed' | 'Recovering';
export type AgentRole = 'Monitoring' | 'Research' | 'Analysis' | 'Writing' | 'Publishing' | 'Strategy';

export interface AgentMetadata {
  version: string;
  trustTier: 'Standard' | 'Elevated' | 'Critical';
  lastSeen: number;
}

export interface AgentPermissions {
  allowed: string[];
  restricted: string[];
}

export interface AgentRecord {
  id: string;
  role: AgentRole;
  capabilities: string[];
  status: AgentHealthState;
  permissions: AgentPermissions;
  metadata: AgentMetadata;
}

export class AgentRegistry {
  private static agents: Map<string, AgentRecord> = new Map();

  static register(agent: AgentRecord) {
    this.agents.set(agent.id, agent);
    console.log(`[AgentRegistry] Registered agent ${agent.id} [${agent.role}] - Tier: ${agent.metadata.trustTier}`);
  }

  static getAgentsByRole(role: AgentRole): AgentRecord[] {
    return Array.from(this.agents.values()).filter(a => a.role === role);
  }

  static getAgent(id: string): AgentRecord | undefined {
    return this.agents.get(id);
  }

  static updateStatus(id: string, status: AgentHealthState) {
    const agent = this.agents.get(id);
    if (agent) {
      agent.status = status;
      agent.metadata.lastSeen = Date.now();
      console.log(`[AgentRegistry] Agent ${id} status updated to: ${status}`);
    }
  }

  static getAllAgents(): AgentRecord[] {
    return Array.from(this.agents.values());
  }
}


const type_stub = (props: any) => null;
export default type_stub;
