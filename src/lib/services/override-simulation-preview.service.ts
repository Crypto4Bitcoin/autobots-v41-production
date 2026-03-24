export class OverrideSimulationPreview {
  static async previewOverride(action: unknown) {
    console.log(`[OverridePreview] Simulating impact of human override:`, action);
    return { expected_result: "STABILITY_RESTORED", risk_delta: -0.45, side_effects: ["Minor Latency Increase"] };
  }
}