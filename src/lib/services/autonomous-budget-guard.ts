export class AutonomousBudgetGuard {
  private static workspaceUsage: Map<string, { decisions: number, plans: number, external: number, hour: number }> = new Map();
  
  private static LIMITS = { decisions: 20, plans: 10, external: 5 };

  /**
   * Limits the number of autonomous actions per workspace per hour.
   */
  static canProceed(workspaceId: string, type: 'decisions' | 'plans' | 'external'): boolean {
    const currentHour = new Date().getHours();
    let usage = this.workspaceUsage.get(workspaceId);

    if (!usage || usage.hour !== currentHour) {
      usage = { decisions: 0, plans: 0, external: 0, hour: currentHour };
    }

    if (usage[type] >= this.LIMITS[type]) {
      console.warn(`[BudgetGuard] Workspace ${workspaceId} exceeded ${type} budget for this hour.`);
      return false;
    }

    usage[type]++;
    this.workspaceUsage.set(workspaceId, usage);
    return true;
  }
}
