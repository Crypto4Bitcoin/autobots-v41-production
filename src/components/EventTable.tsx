import type { EventItem } from '@/lib/types';

export function EventTable({ items }: { items: EventItem[] }) {
  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="cardTitle">Event timeline</div>
          <div className="muted">Public events, model refreshes, and signal markers.</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Event</th>
            <th>Type</th>
            <th>Impact</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={`${item.date}-${item.title}`}>
              <td>{item.date}</td>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.impact}</td>
              <td>{item.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
