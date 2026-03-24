import { supabase } from "./supabase-service";
import { OperatorCommandConsole } from "./operator-command-console";

export class BudgetEnforcementService {
  private commandConsole = new OperatorCommandConsole();

  /**
   * Checks if a workspace is within its budget and enforces restrictions if necessary.
   */
  async enforceBudget(workspaceId: string, currentSpend: number): Promise<{ allow: boolean; mode: "high" | "eco" }> {
    console.log(`[BudgetEnforcement] Checking budget for ${workspaceId}. Current spend: $${currentSpend}`);

    const { data: controls } = await supabase
      .from("workspace_controls")
      .select("budget_limit, budget_alert_threshold")
      .eq("workspace_id", workspaceId)
      .single();

    if (!controls) return { allow: true, mode: "high" };

    const limit = controls.budget_limit || 1000;
    const alertAt = controls.budget_alert_threshold || 0.8; // 80%

    if (currentSpend >= limit) {
      console.error(`[BudgetEnforcement] BUDGET EXCEEDED for ${workspaceId}. Blocking execution.`);
      return { allow: false, mode: "eco" };
    }

    if (currentSpend >= limit * alertAt) {
      console.warn(`[BudgetEnforcement] Budget threshold reached for ${workspaceId}. Switching to ECO mode.`);
      return { allow: true, mode: "eco" };
    }

    return { allow: true, mode: "high" };
  }
}
