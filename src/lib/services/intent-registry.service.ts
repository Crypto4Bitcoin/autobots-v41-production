export interface StrategicGoal { id: string; name: string; weight: number; target: string; }

export class IntentRegistry {
  private static goals: StrategicGoal[] = [
    { id: "legibility", name: "High Human Legibility", weight: 0.8, target: "audit_traces" },
    { id: "stability", name: "Global Network Stability", weight: 0.9, target: "failure_rate" },
    { id: "sovereignty", name: "Operator Sovereignty", weight: 0.95, target: "override_latency" }
  ];

  static getGoals() { return this.goals; }
  static updateGoal(id: string, weight: number) {
    const goal = this.goals.find(g => g.id === id);
    if (goal) goal.weight = weight;
  }
}