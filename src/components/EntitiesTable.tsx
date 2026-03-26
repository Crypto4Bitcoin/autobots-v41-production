import type { DivisionEntity } from '@/lib/types';

export function EntitiesTable({ items }: { items: DivisionEntity[] }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div className="cardTitle">Entities</div>
        <div className="tinyMeta">{items.length} tracked</div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.entityType}</td>
              <td>{item.status}</td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
