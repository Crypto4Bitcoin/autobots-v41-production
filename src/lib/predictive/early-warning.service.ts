export class EarlyWarningService {
  /**
   * Issues intelligence signals based on predictive anomalies.
   */
  static async issueSignal(type: string, description: string) {
    console.warn(`[EarlyWarning] INTELLIGENCE SIGNAL: ${type}`);
    console.log(`[EarlyWarning] ${description}`);
  }
}
