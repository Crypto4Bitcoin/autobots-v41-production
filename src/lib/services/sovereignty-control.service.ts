export interface SovereigntyPosture {
  global_autonomy_enabled: boolean;
  evolution_paused: boolean;
  containment_level: number;
  scopes: Record<string, string>; // e.g. "repair": "full", "routing": "scoped"
  last_override?: { user: string, timestamp: string, reason: string };
}

export class SovereigntyControlService {
  private static state: SovereigntyPosture = {
    global_autonomy_enabled: true,
    evolution_paused: false,
    containment_level: 0,
    scopes: {
      "repair": "full",
      "routing": "full",
      "evolution": "full",
      "federation": "full"
    }
  };

  static getPosture() { return { ...this.state }; }

  static updatePosture(patch: Partial<SovereigntyPosture>) {
    this.state = { ...this.state, ...patch };
    console.log("[Sovereignty] Posture updated:", this.state);
  }

  static isEvolutionAllowed() {
    return this.state.global_autonomy_enabled && !this.state.evolution_paused && this.state.containment_level < 1;
  }
}