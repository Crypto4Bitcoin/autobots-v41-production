'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useCivilMarketBridgeStore } from '@/stores/civilMarketBridgeStore';

export function CivilMarketStateBridgePanel() {
  const { records, lastSyncAt, syncBridge } = useCivilMarketBridgeStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>Civil-Market-State Bridge</h2>
      <p className="mt-1 text-zinc-400">
        Synchronizes market objects into broader world and civic state flows.
      </p>

      <div className="mt-4 flex gap-3">
        <WorldButton
          onClick={() => syncBridge()}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm"
        >
          Sync Bridge
        </WorldButton>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <Stat label="Bridge Records" value={String(records.length)} />
        <Stat label="Last Sync" value={lastSyncAt ?? 'none'} />
        <Stat label="Latest Object" value={records[0]?.objectId ?? 'none'} />
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