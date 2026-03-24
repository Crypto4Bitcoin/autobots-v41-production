export interface Playbook {
  id: string;
  name: string;
  description: string;
  workflow: string[];
  successRate: number;
  timesUsed: number;
}

export class StrategicPlaybookRegistry {
  private static playbooks: Playbook[] = [
    {
      id: 'pb_competitor_response_01',
      name: 'Competitor Launch Response',
      description: 'Standard strategic response to a major competitor product launch.',
      workflow: ['Research Features', 'Analyze Pricing', 'Draft Executive Briefing', 'Simulate Public Response'],
      successRate: 0.95,
      timesUsed: 12
    }
  ];

  static getPlaybooks(): Playbook[] {
    return this.playbooks;
  }

  static promoteToPlaybook(name: string, workflow: string[]) {
    const id = `pb_${Math.random().toString(36).substr(2, 9)}`;
    this.playbooks.push({
      id,
      name,
      description: `Automatically extracted playbook based on successful pattern: ${name}`,
      workflow,
      successRate: 1.0,
      timesUsed: 1
    });
    console.log(`[StrategicPlaybook] Promoted new playbook: ${name}`);
  }
}
