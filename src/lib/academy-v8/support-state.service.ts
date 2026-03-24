export class SupportStateService {
  async choose(input: { readinessScore: number }) {
    if (input.readinessScore >= 0.75) return "ready"
    return "draft"
  }
}
