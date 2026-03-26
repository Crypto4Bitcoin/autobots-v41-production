'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useDistrictRelayStore } from '@/stores/districtRelayStore';

export function DistrictRelayMeshPanel() {
  const { links, signals, bootstrapRelayMesh, sendSignal } = useDistrictRelayStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>District Relay Mesh</h2>
      <p className="mt-1 text-zinc-400">
        Inter-district signal fabric for alerts, oversight, market, and kernel traffic.
      </p>

      <div className="mt-4 flex gap-3">
        <WorldButton
          onClick={() => bootstrapRelayMesh()}
          className="rounded-lg bg-cyan-700 px-4 py-2 text-sm"
        >
          Bootstrap Relay Mesh
        </WorldButton>
        {links[0] && (
          <WorldButton
            onClick={() =>
              sendSignal({
                linkId: links[0].id,
                signalType: 'oversight',
                payloadSummary: 'Manual relay ping from panel.',
              })
            }
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm"
          >
            Send Test Signal
          </WorldButton>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Stat label="Links" value={String(links.length)} />
        <Stat label="Signals" value={String(signals.length)} />
        <Stat
          label="Active Links"
          value={String(links.filter((x) => x.status === 'active').length)}
        />
        <Stat
          label="Last Signal"
          value={signals[0]?.createdAt ?? 'none'}
        />
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