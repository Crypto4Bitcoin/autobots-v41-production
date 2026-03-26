import { DomainContract, DomainMetric, DomainCase } from './types';

export function toCultureContract(state: any): DomainContract {
  const metrics: DomainMetric[] = [
    { id: 'cul-01', label: 'Global Resonance', value: `${state.globalResonance?.toFixed(1) || 0}%`, trend: 'up' },
    { id: 'cul-02', label: 'Persona Count', value: state.personas?.length || 0, trend: 'flat' },
  ];

  const cases: DomainCase[] = (state.personas || []).map((p: any) => ({
    id: p.id,
    title: p.name,
    status: p.resonance > 80 ? 'HARMONIZED' : 'SYNCING',
    priority: 'medium',
    createdAt: new Date().toISOString()
  }));

  return {
    domainId: 'culture',
    title: 'Culture',
    theme: 'indigo',
    status: 'active',
    metrics,
    cases,
    events: [],
    lastUpdated: new Date().toISOString()
  };
}
