export class EvolutionScopeLimiter {
  async checkScope(mutation: unknown): Promise<boolean> {
    const restrictedComponents = ['security', 'governance', 'kernel']
    return !restrictedComponents.includes(mutation.targetComponent)
  }
}