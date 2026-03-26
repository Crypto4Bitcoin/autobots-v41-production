import { SovereigntyControlService } from "../services/sovereignty-control.service";

/**
 * ?? THE INFINITY BALL (PROTECTED CORES)
 * 
 * Every vulnerable point is wrapped in a containment sphere.
 * This is the local defense shell for specific joints.
 */
export class InfinityBall {
  static async withIntegrity(context: string, action: () => Promise<any>) {
    const posture = SovereigntyControlService.getPosture();
    
    // 1. Check Posture (The Flower Shield local slice)
    if (posture.containment_level > 3) {
      console.warn(`[InfinityBall] LOCKED: Global containment level too high for ${context}.`);
      throw new Error(`Sovereign Ball Lock: ${context} is in high-containment quarantine.`);
    }

    // 2. Perform Execution
    try {
      return await action();
    } catch (e: any) {
      // 3. Auto-Containment on Failure (The System Heals)
      if (e.message.includes("bypass") || e.message.includes("violation")) {
        console.error(`[InfinityBall] BREACH DETECTED: AUTO-CORRECTING ${context}...`);
        SovereigntyControlService.updatePosture({ containment_level: posture.containment_level + 1 });
      }
      throw e;
    }
  }
}
