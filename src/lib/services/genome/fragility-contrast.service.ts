export interface FragilityContrast {
  stable_pattern_id: string;
  fragile_pattern_id: string;
  delta_description: string;
  risk_reduction_factor: number;
}

export class ContrastService {
  static getContrasts(): FragilityContrast[] {
    return [
      {
        stable_pattern_id: "Facade Boundary",
        fragile_pattern_id: "Deep Relative Imports",
        delta_description: "Encapsulation prevents dependency breakages during layout refactor.",
        risk_reduction_factor: 0.85
      },
      {
        stable_pattern_id: "Preflight Gating",
        fragile_pattern_id: "Direct Patching",
        delta_description: "Validates code integrity before applying mutations.",
        risk_reduction_factor: 0.92
      }
    ];
  }
}
