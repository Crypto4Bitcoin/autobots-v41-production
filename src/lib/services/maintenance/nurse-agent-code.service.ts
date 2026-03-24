
import { PlaybookService } from "./playbook.service";

export class NurseAgentCode {
  static async applyRepair(plan: unknown) {
    console.log(`[Nurse] Executing ${plan.playbook} on ${plan.target_file}`);
    
    try {
      let result;
      switch (plan.playbook) {
        case "Literal Escape Injection Repair":
          result = await PlaybookService.executeLiteralEscapeRepair(plan.target_file);
          break;
        case "Missing Module Stub Repair":
          result = await PlaybookService.executeMissingModuleStub(plan.target_file, plan.module_name);
          break;
        case "Path Alias Normalization":
          result = await PlaybookService.executePathAliasRepair(plan.target_file);
          break;
        case "Route Handler Contract Repair":
          result = await PlaybookService.executeRouteContractRepair(plan.target_file);
          break;
        default:
          return { status: "failed", reason: "Playbook not supported" };
      }
      return { status: "completed", ...result };
    } catch (e: unknown) {
      return { status: "error", message: e.message };
    }
  }
}
