import type { SourceRecord } from '@/lib/types';

export function SourceTable({ items }: { items: SourceRecord[] }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div className="cardTitle">Sources</div>
        <div className="tinyMeta">{items.length} source records</div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Count</th>
            <th>Confidence</th>
            <th>Verified At</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.label}</td>
              <td>{item.sourceType}</td>
              <td>{item.sourceCount}</td>
              <td>{item.confidenceScore}</td>
              <td>{item.verifiedAt ?? 'n/a'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
