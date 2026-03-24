export class EmergencyExplanationMode {
  static generateIncidentSummary(anomalies: unknown[]) {
    return `INCIDENT SUMMARY: Detected ${anomalies.length} anomalies. AutoBots restricted evolution and scaled down worker groups to preserve stability. Recommended action: Manual Review.`;
  }
}