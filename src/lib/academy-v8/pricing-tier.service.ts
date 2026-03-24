export class PricingTierService {
  async choose(input: { readinessScore: number }) {
    if (input.readinessScore >= 0.88) return "enterprise"
    if (input.readinessScore >= 0.74) return "pro"
    if (input.readinessScore >= 0.58) return "starter"
    return "free"
  }
}
