export interface MemoryAuditRecord {
  id: string;
  workspaceId: string;
  agentId: string;
  action: 'creation' | 'retrieval' | 'update' | 'archival' | 'redaction' | 'deletion';
  fragmentId?: string;
  policyApplied: string[];
  influence?: string;
  timestamp: number;
}

export class MemoryAuditService {
  private static auditTrail: MemoryAuditRecord[] = [];

  /**
   * Enterprise-grade audit trail for all memory operations.
   */
  static log(record: Omit<MemoryAuditRecord, 'id' | 'timestamp'>) {
    const fullRecord: MemoryAuditRecord = {
      ...record,
      id: `m_audit_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    this.auditTrail.push(fullRecord);
    console.log(`[MemoryAudit] Workspace ${record.workspaceId}: ${record.agentId} performed ${record.action}`);
  }

  static getTrail(workspaceId: string): MemoryAuditRecord[] {
    return this.auditTrail.filter(r => r.workspaceId === workspaceId);
  }
}

