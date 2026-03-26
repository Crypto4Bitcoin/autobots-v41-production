'use client';

import { useState } from 'react';
import type { ActionIntent } from '@/lib/types';

async function postAction(body: { intent: ActionIntent; divisionSlug: string; targetId?: string }) {
  const response = await fetch('/api/actions', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  return response.json();
}

export function ActionBar({ slug }: { slug: string }) {
  const [message, setMessage] = useState('Ready');
  const [busy, setBusy] = useState<string | null>(null);

  async function run(intent: ActionIntent) {
    setBusy(intent);
    const result = await postAction({ intent, divisionSlug: slug });
    setMessage(result.message ?? 'Done');
    setBusy(null);
  }

  return (
    <section className="card">
      <div className="sectionHeader">
        <div>
          <div className="cardTitle">Operator controls</div>
          <p className="muted">These buttons are now wired to action endpoints. With DB env set, they log or update records. Without DB env, they run in mock mode.</p>
        </div>
        <div className="tinyMeta">Status: {message}</div>
      </div>
      <div className="buttonRow">
        <button className="button" disabled={Boolean(busy)} onClick={() => run('refresh-signals')}>{busy === 'refresh-signals' ? 'Refreshing...' : 'Refresh signals'}</button>
        <button className="button" disabled={Boolean(busy)} onClick={() => run('run-verifier')}>{busy === 'run-verifier' ? 'Running...' : 'Run verifier'}</button>
        <button className="button" disabled={Boolean(busy)} onClick={() => run('run-simulation')}>{busy === 'run-simulation' ? 'Running...' : 'Run simulation'}</button>
        <button className="button" disabled={Boolean(busy)} onClick={() => run('seed-database')}>{busy === 'seed-database' ? 'Seeding...' : 'Seed database'}</button>
      </div>
    </section>
  );
}
