export class HumanLegibilityEngine {
  static async explainMutation(mutation: unknown, result: unknown) {
    if (result.status === "blocked") {
      return `Mutation ${mutation.mutation_id} (${mutation.proposed_change}) was BLOCKED because it violated the ${result.phase} guardrail. Reason: ${result.reason || "Unknown"}.`;
    }
    if (result.status === "paused") {
      return `Mutation ${mutation.mutation_id} was PAUSED because Operator Sovereignty is active.`;
    }
    return `Mutation ${mutation.mutation_id} (${mutation.proposed_change}) was SUCCESSFULLY PROMOTED to ${mutation.target_id}.`;
  }

  static async explainRepair(incident: unknown, repair: unknown) {
    return `Autonomous Repair ${repair.id} corrected a ${incident.type} in ${incident.location} using ${repair.strategy}. No human intervention was required.`;
  }

  static generateStressSummary(activeIncidents: unknown[]) {
    const count = activeIncidents.length;
    if (count > 5) {
      return `[STRESS MODE] System under HIGH PRESSURE. ${count} active incidents. PRIORITY: Stabilizing core memory and routing. Evolution is AUTO-PAUSED.`;
    }
    return `[NOMINAL] ${count} minor incidents under autonomous repair.`;
  }
}