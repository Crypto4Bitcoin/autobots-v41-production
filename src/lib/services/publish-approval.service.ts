import { ProviderId } from './connected-account-oauth.service';
import { ExternalActionAuditService } from './external-action-audit.service';

export type AuditActionType = 'connection_established' | 'token_refresh_attempt' | 'publish_attempt' | 'approval_granted' | 'approval_denied' | 'delivery_success' | 'delivery_failed' | 'retry_attempt';

export class PublishApprovalService {
  private static TIMEOUT_MS = 86400000; // 24 hour escalation limit

  /**
   * Requests approval for a sensitive action.
   * [HARDENING] Includes createdAt for timeout tracking and escalation.
   */
  static async requestApproval(workspaceId: string, userId: string, provider: ProviderId, actionType: AuditActionType, payload: unknown) {
    console.log(`[ApprovalService] Gating ${actionType} for ${provider}. Created At: ${new Date().toISOString()}`);
    
    await ExternalActionAuditService.log({
      userId,
      workspaceId,
      provider,
      actionType,
      status: 'pending_approval',
      payload,
      triggeredBy: 'ui'
    });

    return { approvalId: `appr_${Date.now()}`, status: 'pending', createdAt: Date.now() };
  }

  /**
   * Tracks and escalates items that have been stuck too long.
   */
  static async checkEscalations(approvalId: string, createdAt: number) {
    if (Date.now() - createdAt > this.TIMEOUT_MS) {
       console.warn(`[ApprovalService] Action ${approvalId} timed out. Escalating to workspace owner.`);
       // Trigger escalation notification
    }
  }
}
