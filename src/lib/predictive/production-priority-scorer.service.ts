export class ProductionPriorityScorerService {
  async score(input: {
    categoryScore: number
    topicScore: number
    contentScore: number
    platformFit: number
    confidence: number
  }) {
    const score =
      input.categoryScore * 0.2 +
      input.topicScore * 0.2 +
      input.contentScore * 0.3 +
      input.platformFit * 0.2 +
      input.confidence * 0.1

    return Math.max(0, Math.min(1, score))
  }
}
