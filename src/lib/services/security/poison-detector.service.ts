export class PoisonDetector {
  async isPoisoned(payload: unknown): Promise<boolean> {
    const patterns = [/eval\(/, /Function\(/, /exec\(/]
    return patterns.some(p => p.test(JSON.stringify(payload)))
  }
}