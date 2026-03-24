export class OperatorTrustScorer {
  async getScore(operatorId: string): Promise<number> {
    // Mock logic: higher score = more trusted
    return operatorId === 'admin' ? 1.0 : 0.6
  }
}