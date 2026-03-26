import type { WatchItem } from '@/lib/types';
import { VerifierBadge } from '@/components/VerifierBadge';

export function WatchlistTable({ items, title }: { items: WatchItem[]; title: string }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="cardTitle">{title}</div>
          <div className="muted">Ranked lanes for follow-up and verifier review.</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Score</th>
            <th>Change</th>
            <th>Verifier</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.score}</td>
              <td className={item.change >= 0 ? 'metricDeltaUp' : 'metricDeltaDown'}>{item.change >= 0 ? '+' : ''}{item.change}%</td>
              <td><VerifierBadge verifier={item.verifier} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
