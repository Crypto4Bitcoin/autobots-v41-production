export interface ConstitutionalRule {
  id: string;
  description: string;
  enforcement: "hard_block" | "warning";
  validator: (mutation: unknown) => boolean;
}

export class SystemDriftConstitution {
  private static rules: ConstitutionalRule[] = [
    { 
      id: "NO_AUDIT_BYPASS", 
      description: "Mutations must not weaken auditability", 
      enforcement: "hard_block", 
      validator: (m) => !m.proposed_change.includes("REDUCE_LOGGING")
    },
    { 
      id: "NO_AUTHORITY_CONCENTRATION", 
      description: "Mutations must not concentrate too much power in a single agent", 
      enforcement: "hard_block", 
      validator: (m) => m.target_id !== "unified_governor" 
    }
  ];

  static validate(mutation: unknown) {
    return this.rules.filter(r => !r.validator(mutation));
  }
}