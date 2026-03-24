import { EvolutionAuditLedger } from "./evolution-audit-ledger.service";

export class StrategicConstraintEngine {
  private static MAX_MUTATIONS_PER_WINDOW = 3;
  private static WINDOW_MS = 60000;

  static async checkTempo() {
    if (typeof window !== "undefined") return { allowed: true };
    const history = EvolutionAuditLedger.getHistory();
    const recentMutations = history.filter(h => 
      h.type === "MUTATION_PROMOTED" && 
      (Date.now() - new Date(h.timestamp).getTime()) < this.WINDOW_MS
    );

    if (recentMutations.length >= this.MAX_MUTATIONS_PER_WINDOW) {
      return { allowed: false, reason: "CONGESTION_CONTROL_ACTIVE", count: recentMutations.length };
    }
    return { allowed: true };
  }
}