import Link from 'next/link';
import { divisions } from '@/lib/divisions';

export default function HomePage() {
  return (
    <div className="pageStack">
      <section className="heroCard">
        <p className="eyebrow">Build scaffold</p>
        <h1>Unified intelligence dashboard scaffold v4</h1>
        <p className="lede">
          This version adds a typed data-access layer, Supabase-ready database hooks, operator action endpoints,
          filter bars, entity and source tables, new missing divisions, CI/test scaffolding, route validation, and
          a build-order document that takes the project from mock shell to operational backend.
        </p>
        <div className="pillRow">
          <span className="pill">9x9x9 lock</span>
          <span className="pill">Shared yearly charts</span>
          <span className="pill">DB-ready loaders</span>
          <span className="pill">Operator controls</span>
          <span className="pill">Integrity scans</span>
          <span className="pill">Missing divisions added</span>
        </div>
      </section>

      <section className="grid twoCol">
        {divisions.map((division) => (
          <Link href={`/${division.slug}`} key={division.slug} className="card linkCard">
            <div className="cardTitle">{division.name}</div>
            <p className="muted">{division.description}</p>
            <div className="tinyMeta">{division.group} → open dashboard</div>
          </Link>
        ))}
      </section>

      <section className="card">
        <div className="cardTitle">What is in v4</div>
        <div className="copyBlock">
          <p>Database-ready query layer, fallback mock mode, route-per-division validation, action endpoints, issue/relay hooks, seed scripts, CI skeleton, tests, staging checklist, and a full phase order for getting from current scaffold to operational system.</p>
          <p>What still needs environment setup: Supabase keys, npm install, migration runs, deployment secrets, and real external ingestion providers.</p>
        </div>
      </section>
    </div>
  );
}
