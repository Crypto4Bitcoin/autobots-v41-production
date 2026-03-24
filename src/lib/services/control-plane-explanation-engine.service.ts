export class ControlPlaneExplanationEngine {
  static explainDecision(decisionType: string, factors: unknown) {
    return `Decision ${decisionType} was made based on factors: ${JSON.stringify(factors)}. Priority given to latency and policy compliance.`;
  }
}