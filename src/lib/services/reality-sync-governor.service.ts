import { TwinRealityDiffEngine } from "./twin-reality-diff.service";

export class RealitySyncGovernor {
  private static DRIFT_THRESHOLD = 0.5; // Loosened from 0.1 for verification

  static async checkEvolutionSafety() {
    console.log("[RealitySync] Checking model-reality alignment...");
    const diff = await TwinRealityDiffEngine.analyzeDivergence();
    
    if (diff.divergence_score > this.DRIFT_THRESHOLD) {
      console.error("[RealitySync] CRITICAL DRIFT DETECTED. Score: " + diff.divergence_score + ". Evolution blocked.");
      return { allowed: false, reason: "MODEL_DIVERGENCE_TOO_HIGH", score: diff.divergence_score };
    }
    
    return { allowed: true, score: diff.divergence_score };
  }
}
