import type { MetricCardData, WatchItem } from '@/lib/types';

type Verifier = MetricCardData['verifier'] | WatchItem['verifier'];

export function VerifierBadge({ verifier }: { verifier: Verifier }) {
  const className = verifier === 'verified' ? 'good' : verifier === 'provisional' ? 'warn' : 'bad';
  return <span className={`badge ${className}`}>{verifier}</span>;
}
