export class MultiProductOpsService {
  async operate(input: { productCount: number; strategyScore: number }) {
    return {
      coordinationScore: Math.max(0, Math.min(1, input.strategyScore * 0.7 + (1 / Math.max(1, input.productCount)) * 0.3)),
    }
  }
}
