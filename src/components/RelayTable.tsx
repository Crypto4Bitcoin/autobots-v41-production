import type { RelayItem } from '@/lib/types';

export function RelayTable({ items }: { items: RelayItem[] }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="cardTitle">Back-brain relay exchange</div>
          <div className="muted">How findings move between divisions, labs, and verifier cells.</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Lane</th>
            <th>Status</th>
            <th>Payload</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.from}-${item.to}-${item.lane}`}>
              <td>{item.from}</td>
              <td>{item.to}</td>
              <td>{item.lane}</td>
              <td>{item.status}</td>
              <td>{item.payload}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
