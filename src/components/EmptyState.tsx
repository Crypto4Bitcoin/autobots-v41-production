export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="card emptyState">
      <div className="cardTitle">{title}</div>
      <p className="muted">{copy}</p>
    </section>
  );
}
