'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="pageStack">
      <section className="card">
        <div className="cardTitle">Something failed</div>
        <p className="muted">{error.message}</p>
        <button className="button" onClick={() => reset()}>Try again</button>
      </section>
    </div>
  );
}
