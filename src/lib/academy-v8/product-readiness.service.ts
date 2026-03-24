export class ProductReadinessService {
  async score(input: { prototypeScore: number; deploymentComplexity: number }) {
    return Math.max(0, Math.min(1, input.prototypeScore * 0.7 + (1 - input.deploymentComplexity) * 0.3))
  }
}
