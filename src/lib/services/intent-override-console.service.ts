// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IntentRegistryV2 } from "./intent-registry-v2.service";
import { AuthorityAuditLedger } from "./authority-audit-ledger.service";

export class IntentOverrideConsole {
  static async adjustPriority(intentId: string, newPriority: number, rational: string) {
    console.log(`[IntentOverride] Adjusting ${intentId} priority to ${newPriority}. Rationale: ${rational}`);
    AuthorityAuditLedger.logAuthorityAction("OPERATOR-01", "INTENT_OVERRIDE", { intentId, newPriority, rational });
    return { success: true };
  }
}