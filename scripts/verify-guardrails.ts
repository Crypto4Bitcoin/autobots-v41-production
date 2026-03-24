import { IdempotentExternalActionGuard } from '../src/lib/services/idempotent-guard.service';
import { RealPublishExecutionService } from '../src/lib/services/real-publish-execution.service';
import { WorkspacePolicyService } from '../src/lib/services/workspace-policy.service';
import { ExternalActionAuditService } from '../src/lib/services/external-action-audit.service';

async function runVerification() {
  console.log("--- Starting Boundary Case Verification ---");

  // 1. Duplicate Publish Prevention
  const actionId = "test_action_123";
  const first = IdempotentExternalActionGuard.isDuplicate(actionId);
  const second = IdempotentExternalActionGuard.isDuplicate(actionId);
  console.log(`[Test 1] Duplicate check: 1st=${first}, 2nd=${second}`);

  // 2. Voice Parity - Policy Enforcement
  const uiPerm = await WorkspacePolicyService.isActionPermitted('ws_test', 'publish', 'slack', 'ui');
  const voicePerm = await WorkspacePolicyService.isActionPermitted('ws_test', 'publish', 'slack', 'voice');
  console.log(`[Test 2] Voice Parity: UI=${uiPerm.allowed}, Voice=${voicePerm.allowed}`);

  // 3. Audit Trail Verification
  const auditId = await ExternalActionAuditService.log({
    userId: 'user_001',
    workspaceId: 'ws_test',
    provider: 'x',
    actionType: 'token_refresh_attempt',
    status: 'failed',
    payload: { reason: 'expired' },
    triggeredBy: 'worker'
  });
  console.log(`[Test 3] Audit Log ID: ${auditId}`);

  // 4. Draft Mode Support
  const draftResult = await RealPublishExecutionService.createDraft('ws_test', 'linkedin', {
    title: 'Test Briefing',
    content: 'Sensitive content...',
    actionId: 'action_456'
  }, 'voice');
  console.log(`[Test 4] Draft Support: ${draftResult.status}`);

  console.log("--- Verification Complete ---");
}

runVerification().catch(console.error);
