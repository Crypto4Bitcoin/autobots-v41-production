import type { AgentNode } from '../world/types';

export function canAgentBeAssigned(agent: AgentNode) {
  return agent.status !== 'paused' && agent.status !== 'jailed';
}

export function jailAgent(agent: AgentNode): AgentNode {
  return {
    ...agent,
    status: 'jailed',
  };
}

export function releaseAgent(agent: AgentNode): AgentNode {
  return {
    ...agent,
    status: 'idle',
  };
}
