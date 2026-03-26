import { DomainContract, DomainMetric, DomainCase } from './types';

export function toControlContract(state: any): DomainContract {
  const metrics: DomainMetric[] = [
    { id: 'ctl-01', label: 'Objectives', value: state.objectives?.length || 0, trend: 'up' },
    { id: 'ctl-02', label: 'Decision Parity', value: '98%', trend: 'flat' },
  ];

  const cases: DomainCase[] = (state.decisions || []).slice(0, 5).map((d: any) => ({
    id: `dec-${Math.random()}`,
    title: d.explanation.substring(0, 40) + '...',
    status: 'RESOLVED',
    createdAt: d.timestamp || new Date().toISOString()
  }));

  return {
    domainId: 'control',
    title: 'Control',
    theme: 'emerald',
    status: 'active',
    metrics,
    cases,
    events: [],
    lastUpdated: new Date().toISOString()
  };
}
