import type { IssueItem } from '@/lib/types';

const severityClass: Record<IssueItem['severity'], string> = {
  low: 'good',
  medium: 'warn',
  high: 'bad',
  critical: 'bad',
};

export function IssueTable({ items }: { items: IssueItem[] }) {
  return (
    <section className="card">
      <div className="sectionHeader panelHeader">
        <div>
          <div className="cardTitle">Integrity issues</div>
          <div className="muted">Loophole, drift, relay, and verifier findings currently under review.</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Description</th>
            <th>Affected modules</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.type}</td>
              <td className={severityClass[item.severity]}>{item.severity}</td>
              <td>{item.status}</td>
              <td>{item.description}</td>
              <td>{item.affectedModules.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
