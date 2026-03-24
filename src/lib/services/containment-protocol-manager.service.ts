import { SovereigntyControlService } from "./sovereignty-control.service";

export class ContainmentProtocolManager {
  static async applyLevel(level: number) {
    console.log(`[Containment] Applying Level ${level}...`);
    SovereigntyControlService.updatePosture({ containment_level: level });
    
    if (level >= 1) SovereigntyControlService.updatePosture({ evolution_paused: true });
    
    return { success: true, active_level: level };
  }
}