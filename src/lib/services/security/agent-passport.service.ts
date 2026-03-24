export interface AgentPassport {
  agentId: string
  signature: string
  capabilities: string[]
  expiresAt: string
}

export class AgentPassportService {
  async issue(agentId: string, capabilities: string[]): Promise<AgentPassport> {
    return {
      agentId,
      signature: `sig-${Math.random().toString(36).substring(7)}`,
      capabilities,
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    }
  }

  async validate(passport: AgentPassport): Promise<boolean> {
    return new Date(passport.expiresAt) > new Date()
  }
}