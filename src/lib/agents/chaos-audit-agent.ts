export class ChaosAuditAgent {
  static logs: unknown[] = [];

  static logEvent(event: unknown) {
    const logEntry = { ...event, timestamp: new Date().toISOString() };
    this.logs.push(logEntry);
    console.log(`[ChaosAudit] Event Recorded: ${event.type}`);
  }

  static getAuditTrail() {
    return this.logs;
  }
}