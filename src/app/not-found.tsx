import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pageStack">
      <section className="card">
        <div className="cardTitle">Page not found</div>
        <p className="muted">The division route was not found or has not been registered yet.</p>
        <Link href="/" className="buttonLink">Return home</Link>
      </section>
    </div>
  );
}
