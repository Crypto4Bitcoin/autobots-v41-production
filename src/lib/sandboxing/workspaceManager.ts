export interface Sandbox { agentId: string; virtualPath: string; hardenedStatus: number; isActive: boolean }
export function initializeSandbox(agentId: string): Sandbox {
  // Phase 201: Workspace containment initialization
  return { agentId, virtualPath: `/vfs/agent_${agentId}`, hardenedStatus: 100, isActive: true };
}
