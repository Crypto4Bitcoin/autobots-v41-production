'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { usePlanetaryReadinessStore } from '@/stores/planetaryReadinessStore';

export function PlanetaryReadinessAssemblyPanel() {
  const {
    score,
    defenseScore,
    oversightScore,
    relayScore,
    bridgeScore,
    calculatedAt,
    recalculateReadiness,
  } = usePlanetaryReadinessStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>Planetary Readiness Assembly</h2>
      <p className="mt-1 text-zinc-400">
        Aggregates defense, oversight, relay, and bridge health into one readiness score.
      </p>

      <div className="mt-4 flex gap-3">
        <WorldButton
          onClick={() => recalculateReadiness()}
          className="rounded-lg bg-violet-700 px-4 py-2 text-sm"
        >
          Recalculate Readiness
        </WorldButton>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        <Stat label="Planetary Score" value={String(score)} />
        <Stat label="Defense" value={String(defenseScore)} />
        <Stat label="Oversight" value={String(oversightScore)} />
        <Stat label="Relay" value={String(relayScore)} />
        <Stat label="Bridge" value={String(bridgeScore)} />
      </div>

      <div className="mt-4">
        <Stat label="Calculated At" value={calculatedAt ?? 'none'} />
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