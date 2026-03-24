import { supabase } from "./supabase-service";

export interface CostRecord {
  workflow_run_id: string;
  node_id: string;
  capability_key: string;
  amount_usd: number;
  dimensions: {
    provider_cost: number;
    compute_cost: number;
    storage_cost: number;
  };
  timestamp: string;
}

export class CostAccountingService {
  /**
   * Logs a cost record for a specific capability execution.
   */
  async logCost(record: Omit<CostRecord, "timestamp">) {
    console.log(`[CostAccounting] Logging cost for ${record.capability_key}: $${record.amount_usd}`);

    const { error } = await supabase.from("cost_records").insert([{
      ...record,
      timestamp: new Date().toISOString()
    }]);

    if (error) {
        console.error("[CostAccounting] Failed to persist cost record:", error);
    }
  }

  /**
   * Retrieves the total cost for a specific workspace within a timeframe.
   */
  async getWorkspaceSpend(workspaceId: string, timeframe: "today" | "month"): Promise<number> {
    // In production, this would query aggregated materialized views
    return timeframe === "today" ? 12.45 : 450.20;
  }
}
