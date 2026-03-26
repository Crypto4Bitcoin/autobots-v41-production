'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useMemo } from 'react';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

export function SecurityReplayPanel() {
  const { events, snapshots, getMetrics, replayCurrentState, takeSnapshot } =
    useSecurityReplayStore();

  const metrics = useMemo(() => getMetrics(), [events, snapshots, getMetrics]);
  const replay = useMemo(() => replayCurrentState(), [events, replayCurrentState]);

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>Deterministic Security Replay</h2>
      <p className="mt-1 text-zinc-400">
        Chained event log for replay, audit proof, and state reconstruction.
      </p>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        <Stat label="Events" value={String(metrics.totalEvents)} />
        <Stat label="Snapshots" value={String(metrics.totalSnapshots)} />
        <Stat label="Tick" value={String(metrics.currentTick)} />
        <Stat label="Chain Healthy" value={String(metrics.chainHealthy)} />
        <Stat label="Last Event" value={metrics.lastEventAt ?? 'none'} />
      </div>

      <div className="mt-4">
        <WorldButton
          onClick={() => takeSnapshot()}
          className="rounded-lg bg-blue-700 px-4 py-2 text-sm"
        >
          Take Snapshot
        </WorldButton>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="District Bootstrapped" value={String(replay.districtBootstrapped)} />
        <Stat label="Breached Cells" value={String(replay.breachedCells)} />
        <Stat label="Fortified Cells" value={String(replay.fortifiedCells)} />
        <Stat label="Released Assets" value={String(replay.releasedAssets)} />
        <Stat label="Alerts" value={String(replay.alerts)} />
        <Stat label="Lockdown" value={String(replay.lockdown)} />
        <Stat label="Completed Phases" value={String(replay.completedPhases.length)} />
        <Stat label="Cycles" value={String(replay.cyclesExecuted)} />
      </div>

      <div className="mt-6 space-y-3">
        {events.slice(-5).reverse().map((event) => (
          <div key={event.id} className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">
                {event.tick} • {event.type}
              </p>
              <span className="rounded-full bg-purple-700 px-3 py-1 text-xs">
                {event.domain}
              </span>
            </div>
            <p className={`${worldTheme.sectionLabel}mt-2 text-xs  break-all`.trim()}>
              hash: {event.hash}
            </p>
            <p className={`${worldTheme.sectionLabel}mt-1 text-xs  break-all`.trim()}>
              prev: {event.prevHash ?? 'null'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${worldTheme.panel} `.trim()}>
      <p className={`${worldTheme.sectionLabel}`.trim()}>{label}</p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  );
}