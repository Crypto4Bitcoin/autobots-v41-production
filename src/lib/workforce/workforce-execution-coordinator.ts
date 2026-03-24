import { AutonomousBudgetGuard } from '../services/autonomous-budget-guard';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PlanIdempotencyGuard } from '../services/plan-idempotency.guard';

export class WorkforceExecutionCoordinator {
  /**
   * Final gate translating agent work into governed system actions.
   */
  static async executeGovernedAction(workspaceId: string, actionType: 'decisions' | 'plans' | 'actions', actionFn: () => Promise<unknown>) {
    console.log(`[WorkforceExecution] Validating governance for action: ${actionType}`);

    // [HARDENING] Map 'actions' to 'external' for budget tracking
    const budgetType = actionType === 'actions' ? 'external' : actionType;

    // 1. Budget Check
    if (!AutonomousBudgetGuard.canProceed(workspaceId, budgetType)) {
      console.error(`[WorkforceExecution] Budget block: ${actionType} exceeded for workspace ${workspaceId}`);
      throw new Error(`Execution blocked: ${actionType} budget exceeded.`);
    }

    // 2. Policy & Approval Check (Simplified for now - hooks into Phase 68 services)
    // 3. Execution
    try {
      const result = await actionFn();
      console.log(`[WorkforceExecution] Action ${actionType} completed successfully.`);
      return result;
    } catch (error) {
      console.error(`[WorkforceExecution] Action ${actionType} failed:`, error);
      throw error;
    }
  }
}
