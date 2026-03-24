import { SovereigntyControlService } from "./sovereignty-control.service";

export class InterruptAuthorityEngine {
  static async triggerEmergencyPause(reason: string, user: string) {
    console.log(`[Interrupt] EMERGENCY PAUZE TRIGGERED by ${user}: ${reason}`);
    SovereigntyControlService.updatePosture({
      global_autonomy_enabled: false,
      last_override: { user, reason, timestamp: new Date().toISOString() }
    });
    return { status: "paused", timestamp: new Date().toISOString() };
  }

  static async resumeAutonomy(user: string) {
    console.log(`[Interrupt] Autonomy RESUMED by ${user}`);
    SovereigntyControlService.updatePosture({ global_autonomy_enabled: true });
    return { status: "active" };
  }
}