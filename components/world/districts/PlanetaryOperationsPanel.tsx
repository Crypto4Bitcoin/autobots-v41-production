'use client'

import { usePlanetaryFabricStore } from '@/stores/planetaryFabricStore'

export function PlanetaryOperationsPanel() {
  const {
    running,
    startFabric,
    stopFabric,
    cyclesExecuted,
    lastCycleAt,
    lastMetrics
  } = usePlanetaryFabricStore()

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-2xl font-semibold">
        Planetary Operations Fabric
      </h2>

      <p className="text-zinc-400 mt-1">
        Global runtime coordinating defense districts, market autoposter,
        and oversight citadel.
      </p>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">

        <Stat label="Runtime" value={running ? 'running' : 'stopped'} />

        <Stat label="Cycles Executed" value={String(cyclesExecuted)} />

        <Stat label="Last Cycle" value={lastCycleAt ?? 'none'} />

        <Stat
          label="Market Releases"
          value={String(lastMetrics?.releasedAssets ?? 0)}
        />

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={startFabric}
          className="px-4 py-2 rounded bg-green-700 hover:bg-green-600 transition"
        >
          Start Fabric
        </button>

        <button
          onClick={stopFabric}
          className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 transition"
        >
          Stop Fabric
        </button>

      </div>

    </section>
  )
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
      <p className="text-zinc-500">{label}</p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  )
}
