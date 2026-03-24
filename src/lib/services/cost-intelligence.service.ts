export class CostIntelligenceService {
  /**
   * Analyzes platform costs and resource efficiency from the event backbone.
   */
  async analyzeCosts(events: unknown[]) {
    console.log("[CostIntelligence] Analyzing platform spend and resource efficiency...");
    
    const totals: Record<string, { runs: number; cost: number; avgCost?: number }> = {};

    events.forEach(e => {
      // Use capability from event payload
      const cap = e.payload?.capability || "unknown";
      const cost = e.payload?.cost_usd || 0;

      if (!totals[cap]) {
        totals[cap] = { runs: 0, cost: 0 };
      }

      totals[cap].runs++;
      totals[cap].cost += cost;
    });

    // Calculate averages and identifying cost outliers
    Object.keys(totals).forEach(cap => {
      if (totals[cap].runs > 0) {
        totals[cap].avgCost = totals[cap].cost / totals[cap].runs;
      }
    });

    return totals;
  }
}
