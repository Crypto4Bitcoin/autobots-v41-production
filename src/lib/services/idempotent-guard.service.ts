export class IdempotentExternalActionGuard {
  private static recentActions = new Set<string>();

  /**
   * Checks if an action with a specific ID has already been executed.
   */
  static isDuplicate(actionId: string): boolean {
    if (this.recentActions.has(actionId)) {
      console.warn(`[IdempotentGuard] Duplicate action blocked: ${actionId}`);
      return true;
    }
    this.recentActions.add(actionId);
    
    // Auto-cleanup after 10 minutes for the demo
    setTimeout(() => this.recentActions.delete(actionId), 600000);
    return false;
  }
}
