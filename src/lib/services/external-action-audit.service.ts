import { ProviderId } from './connected-account-oauth.service';

export interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  workspaceId: string;
  provider: ProviderId;
  actionType: 'connection_established' | 'token_refresh_attempt' | 'publish_attempt' | 'approval_granted' | 'approval_denied' | 'delivery_success' | 'delivery_failed' | 'retry_attempt';
  status: 'pending_approval' | 'executed' | 'denied' | 'failed' | 'retrying' | 'success';
  payload: unknown;
  providerResponse?: unknown;
  error?: string;
  triggeredBy: 'ui' | 'worker' | 'voice';
}

export class ExternalActionAuditService {
  /**
   * Logs every outbound action attempt, approval, denial, retry, provider response, token refresh, and failure.
   */
  static async log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<string> {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fullEntry: AuditEntry = {
      ...entry,
      id,
      timestamp: new Date().toISOString()
    };
    
    console.log(`[AuditLog] [${fullEntry.triggeredBy.toUpperCase()}] ${fullEntry.status.toUpperCase()}: ${fullEntry.actionType} on ${fullEntry.provider}`, {
      id: fullEntry.id,
      workspace: fullEntry.workspaceId
    });

    // In production, save to 'audit_logs' table in Supabase.
    return id;
  }
}
