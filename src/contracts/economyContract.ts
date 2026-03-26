import { DomainContract, DomainMetric, DomainCase, validateContract } from './types';

export function toEconomyContract(state: any): DomainContract {
  const metrics: DomainMetric[] = [
    { id: 'eco-01', label: 'Sovereign Credits', value: state.sovereignCredits, unit: '¢', trend: 'up' },
    { id: 'eco-02', label: 'Transaction Count', value: state.ledger?.length || 0, trend: 'flat' },
  ];

  const cases: DomainCase[] = (state.ledger || []).slice(0, 5).map((l: any) => ({
    id: l.id || `tx-${Math.random()}`,
    title: `TX: ${l.action}`,
    status: 'COMPLETED',
    createdAt: l.timestamp || new Date().toISOString()
  }));

  return validateContract({
    domainId: 'economy',
    title: 'Economy',
    theme: 'violet',
    status: 'active',
    metrics,
    cases,
    events: [],
    lastUpdated: new Date().toISOString()
  });
}
