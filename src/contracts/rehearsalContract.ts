import { DomainContract, DomainMetric, DomainCase, validateContract } from './types';

export function toRehearsalContract(state: any): DomainContract {
  const metrics: DomainMetric[] = [
    { id: 'reh-01', label: 'Active Scenarios', value: state.scenarios?.length || 0, trend: 'up' },
    { id: 'reh-02', label: 'Simulation State', value: state.isSimulating ? 'SIMULATING' : 'READY', trend: 'flat' },
  ];

  const cases: DomainCase[] = (state.scenarios || []).map((s: any) => ({
    id: s.id,
    title: s.name,
    status: state.selectedScenario?.id === s.id ? 'SELECTED' : 'DORMANT',
    priority: 'high',
    createdAt: new Date().toISOString()
  }));

  return validateContract({
    domainId: 'rehearsal',
    title: 'Rehearsal',
    theme: 'violet',
    status: state.isSimulating ? 'active' : 'idle',
    metrics,
    cases,
    events: [],
    lastUpdated: new Date().toISOString()
  });
}
