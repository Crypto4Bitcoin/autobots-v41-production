import { EvolutionAuditLedger } from "./evolution-audit-ledger.service";
import { SovereigntyControlService } from "./sovereignty-control.service";

export type OverrideLevel = "engineering" | "legal" | "emergency";

export class OverrideChainSystem {
  static async applyOverride(level: OverrideLevel, scope: string, user: string, duration_sec: number) {
    console.log(`[Override] ${level.toUpperCase()} OVERRIDE started by ${user} on scope ${scope}...`);
    
    const expiry = new Date(Date.now() + duration_sec * 1000).toISOString();
    
    SovereigntyControlService.updatePosture({
      last_override: { user, reason: `Scoped ${level} override`, timestamp: new Date().toISOString() }
    });

    EvolutionAuditLedger.logEvent({
      type: "OPERATOR_OVERRIDE",
      level,
      scope,
      user,
      expiry
    });

    return { status: "override_active", level, expiry };
  }
}