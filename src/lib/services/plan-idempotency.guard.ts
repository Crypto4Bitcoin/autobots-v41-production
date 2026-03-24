export class PlanIdempotencyGuard {
  private static activePlans: Set<string> = new Set();

  /**
   * Ensures identical plans are not executed twice for the same event cluster.
   */
  static canExecute(planHash: string): boolean {
    if (this.activePlans.has(planHash)) {
      console.warn(`[PlanIdempotency] Blocking duplicate plan execution for hash: ${planHash}`);
      return false;
    }
    this.activePlans.add(planHash);
    return true;
  }
}
