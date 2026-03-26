import type { ScenarioItem } from '@/lib/types';

const resultClass: Record<ScenarioItem['result'], string> = {
  pass: 'good',
  warn: 'warn',
  fail: 'bad',
};

export function ScenarioTable({ items }: { items: ScenarioItem[] }) {
  return (
    <section className="card">
      <div className="sectionHeader panelHeader">
        <div>
          <div className="cardTitle">Failure simulation deck</div>
          <div className="muted">Replay cases, edge scenarios, and stress tests for the loophole layer.</div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Outcome</th>
            <th>Result</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.outcome}</td>
              <td className={resultClass[item.result]}>{item.result}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
