'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useCountermeasureStore } from '@/stores/countermeasureStore';

export function CountermeasureRoutingPanel() {
  const { routes, autoRouteBreaches } = useCountermeasureStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>Autonomous Countermeasure Routing</h2>
      <p className="mt-1 text-zinc-400">
        Breach classes auto-dispatch the right agent classes into the defense fabric.
      </p>

      <div className="mt-4 flex gap-3">
        <WorldButton
          onClick={() => autoRouteBreaches()}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm"
        >
          Auto Route Breaches
        </WorldButton>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="Routes" value={String(routes.length)} />
        <Stat
          label="Queued"
          value={String(routes.filter((r) => r.status === 'queued').length)}
        />
        <Stat
          label="Dispatched"
          value={String(routes.filter((r) => r.status === 'dispatched').length)}
        />
        <Stat
          label="Resolved"
          value={String(routes.filter((r) => r.status === 'resolved').length)}
        />
      </div>

      <div className="mt-6 space-y-3">
        {routes.length === 0 ? (
          <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400`.trim()}>
            No countermeasure routes yet.
          </div>
        ) : (
          routes.slice(0, 6).map((route) => (
            <div key={route.id} className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{route.id}</p>
                  <p className="text-sm text-zinc-400">
                    Cell {route.cellId} • {route.threatType} • {route.threatLevel}
                  </p>
                </div>
                <span className="rounded-full bg-orange-700 px-3 py-1 text-xs">
                  {route.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Stat label="Primary" value={route.primaryClass} />
                <Stat label="Support" value={route.supportClasses.join(', ')} />
                <Stat label="Agents" value={String(route.assignedAgents)} />
                <Stat label="Created" value={route.createdAt} />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${worldTheme.panel} rounded-xl bg-zinc-900 border border-zinc-800 p-3`.trim()}>
      <p className={`${worldTheme.sectionLabel}`.trim()}>{label}</p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  );
}