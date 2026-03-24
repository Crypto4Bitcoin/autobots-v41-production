'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useWorldKernelStore } from '@/stores/worldKernelStore';
import { usePlanetaryFabricStore } from '@/stores/planetaryFabricStore';
import { usePlanetaryReadinessStore } from '@/stores/planetaryReadinessStore';
import { useDistrictRelayStore } from '@/stores/districtRelayStore';
import { useCivilMarketBridgeStore } from '@/stores/civilMarketBridgeStore';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

export function PlanetaryOperationsFabricPanel() {
  const kernel = useWorldKernelStore();
  const fabric = usePlanetaryFabricStore();
  const readiness = usePlanetaryReadinessStore();
  const relay = useDistrictRelayStore();
  const bridge = useCivilMarketBridgeStore();
  const replay = useSecurityReplayStore();

  const syncFabric = () => {
    relay.bootstrapRelayMesh();
    bridge.syncBridge();
    readiness.recalculateReadiness();
    kernel.syncWorld();

    replay.logEvent({
      domain: 'kernel',
      type: 'planetary_fabric_synced',
      payload: {
        readiness: readiness.score,
        relays: relay.links.length,
        bridgeRecords: bridge.records.length,
      },
    });
  };

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold">Planetary Operations Fabric</h2>
      <p className="mt-1 text-zinc-400">
        Unified top-layer command across defense, market, relay, oversight, and readiness systems.
      </p>

      <div className="mt-4 flex gap-3">
        <WorldButton
          onClick={syncFabric}
          className="rounded-lg bg-fuchsia-700 px-4 py-2 text-sm"
        >
          Sync Planetary Fabric
        </WorldButton>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
        <Stat label="World Status" value={kernel.worldStatus} />
        <Stat label="Current Phase" value={String(kernel.currentPhase)} />
        <Stat label="Runtime" value={fabric.running ? 'running' : 'stopped'} />
        <Stat label="Readiness" value={String(readiness.score)} />
        <Stat label="Relay Links" value={String(relay.links.length)} />
        <Stat label="Bridge Records" value={String(bridge.records.length)} />
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