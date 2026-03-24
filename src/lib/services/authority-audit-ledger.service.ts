export class AuthorityAuditLedger {
  private static events: unknown[] = [];

  static logAuthorityAction(actor: string, action: string, context: unknown) {
    const log = { timestamp: new Date().toISOString(), actor, action, context };
    this.events.push(log);
    console.log(`[Audit] AUTHORITY ACTION: ${actor} -> ${action}`);
  }

  static getAuditLogs() { return this.events; }
}