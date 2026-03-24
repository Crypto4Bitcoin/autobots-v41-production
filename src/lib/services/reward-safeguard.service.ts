export class RewardSafeguardAgent {
  static validateObjectives(proposed_gain: number, stability_delta: number) {
    console.log(`[RewardSafeguard] Validating objectives: Gain=${proposed_gain}, StabilityDelta=${stability_delta}`);
    
    // Prevent "Reward Hacking" where performance increases but stability drops too much
    if (stability_delta < -0.05 && proposed_gain > 0.1) {
      return { valid: false, reason: "UNBALANCED_OPTIMIZATION_DETECTED_STABILITY_PRIORITY" };
    }
    
    return { valid: true };
  }
}