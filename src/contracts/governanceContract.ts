import { DomainContract, DomainMetric, DomainCase, validateContract } from './types';

export function toGovernanceContract(state: any): DomainContract {
  const metrics: DomainMetric[] = [
    { id: 'leg-01', label: 'Total Legislation', value: state.totalLegislation, trend: 'up' },
    { id: 'leg-02', label: 'Ratification Flow', value: state.isRatifying ? 'ACTIVE' : 'IDLE' },
  ];

  const cases: DomainCase[] = (state.accords || []).map((a: any) => ({
    id: a.id,
    title: a.title,
    status: a.status.toUpperCase(),
    priority: a.status === 'ratifying' ? 'high' : 'medium',
    createdAt: new Date().toISOString()
  }));

  return validateContract({
    domainId: 'governance',
    title: 'Governance',
    theme: 'gold',
    status: state.isRatifying ? 'active' : 'idle',
    metrics,
    cases,
    events: [],
    lastUpdated: new Date().toISOString()
  });
}
