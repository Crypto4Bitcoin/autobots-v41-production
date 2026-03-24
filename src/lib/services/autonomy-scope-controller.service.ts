import { SovereigntyControlService } from "./sovereignty-control.service";

export type AutonomyPosture = "manual" | "assisted" | "scoped" | "full";

export class AutonomyScopeController {
  static async setScopePosture(scope: string, posture: AutonomyPosture) {
    console.log(`[ScopeControl] Setting ${scope} to ${posture} mode.`);
    const current = SovereigntyControlService.getPosture();
    const newScopes = { ...current.scopes, [scope]: posture };
    SovereigntyControlService.updatePosture({ scopes: newScopes });
    
    return { scope, posture, success: true };
  }

  static isAutonomyPermitted(scope: string, required_level: AutonomyPosture = "scoped") {
    const current = SovereigntyControlService.getPosture();
    if (!current.global_autonomy_enabled) return false;
    
    const level = current.scopes[scope] || "manual";
    const levels: AutonomyPosture[] = ["manual", "assisted", "scoped", "full"];
    return levels.indexOf(level) >= levels.indexOf(required_level);
  }
}