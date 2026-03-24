'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useCivilMarketBridgeStore } from '@/stores/civilMarketBridgeStore';

export function CivilMarketStateBridgePanel() {
  const { records, lastSyncAt, syncBridge } = useCivilMarketBridgeStore();

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold">Civil-Market-State Bridge</h2>
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
    <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  );
}