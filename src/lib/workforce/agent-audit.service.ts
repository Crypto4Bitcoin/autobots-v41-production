export interface AuditRecord {
  id: string;
  eventId: string;
  taskId: string;
  agentId: string;
  action: string;
  context: unknown;
  timestamp: number;
}

export class AgentAuditService {
  private static auditTrail: AuditRecord[] = [];

  /**
   * Complete traceability of Event -> Agent -> Task -> Handoff -> Final Action.
   */
  static log(record: Omit<AuditRecord, 'id' | 'timestamp'>) {
    const fullRecord: AuditRecord = {
      ...record,
      id: `audit_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    this.auditTrail.push(fullRecord);
    console.log(`[AgentAudit] ${fullRecord.agentId} performed ${fullRecord.action} for task ${fullRecord.taskId}`);
  }

  static getTrail(eventId?: string): AuditRecord[] {
    if (eventId) {
      return this.auditTrail.filter(r => r.eventId === eventId);
    }
    return this.auditTrail;
  }
}

