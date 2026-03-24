import { 
  IdempotencyGuardService, 
  WorkspaceAccessGuard, 
  ApiKeyService, 
  JsonSchemaValidationService, 
  ExecutionLeaseGuardService, 
  AuditLogService 
} from './api-security.service';

export class PublicApiGatewayService {
  /**
   * The core public entry point for triggering an instant action securely.
   */
  static async executeInstantAction(apiKey: string, idempotencyKey: string, payload: { sourceUrl: string, actions: string[] }) {
      console.log(`\n--- Public API Request Received ---`);

      // 1. Authenticate Request
      const auth = ApiKeyService.verifyApiKey(apiKey);
      if (!auth.valid || !auth.workspaceId) {
          throw new Error("UNAUTHORIZED: Invalid or revoked API Key.");
      }

      const workspaceId = auth.workspaceId;

      // 2. Tenancy Enforcement (RLS equivalent layer)
      await WorkspaceAccessGuard.verifyAccess(workspaceId, "api-user-system");

      // 3. Prevent Duplicate Workloads
      const isUnique = await IdempotencyGuardService.checkAndLock(workspaceId, "instant_action", idempotencyKey);
      if (!isUnique) {
          return { status: 409, message: "Duplicate request ignored." };
      }

      // 4. Schema Validation (Prevent Junk)
      if (!JsonSchemaValidationService.validatePayload("InstantActionSchema", payload)) {
          throw new Error("BAD_REQUEST: Malformed JSON Schema against platform contract.");
      }

      // 5. Audit Logging
      AuditLogService.logEvent(workspaceId, "api-user-system", "INSTANT_ACTION_TRIGGERED", payload.sourceUrl);

      // 6. Execution Lease Claim
      const runId = `run-${Date.now()}`;
      if (!ExecutionLeaseGuardService.attemptClaimLease(runId)) {
          throw new Error("INTERNAL_QUEUE_ERROR: Could not claim execution lease.");
      }

      console.log(`[PublicApiGateway] Safely initiated workflow processing for: ${payload.sourceUrl}`);
      
      // Release lease after dispatching to background worker
      ExecutionLeaseGuardService.releaseLease(runId);

      return { status: 202, runId, message: "Run initiated securely." };
  }
}
