import { create } from 'zustand'
import { runPlanetaryCycle } from '@/lib/world/planetaryRuntime'

type FabricState = {
  running: boolean
  cycleIntervalMs: number
  lastCycleAt: string | null
  cyclesExecuted: number
  lastMetrics: unknown
}

type FabricActions = {
  startFabric: () => void
  stopFabric: () => void
  runCycle: () => Promise<void>
}

export const usePlanetaryFabricStore = create<FabricState & FabricActions>((set, get) => ({
  running: false,
  cycleIntervalMs: 60000,
  lastCycleAt: null,
  cyclesExecuted: 0,
  lastMetrics: null,

  startFabric: () => {
    if (get().running) return

    set({ running: true })

    const loop = async () => {
      if (!get().running) return

      await get().runCycle()

      setTimeout(loop, get().cycleIntervalMs)
    }

    loop()
  },

  stopFabric: () => {
    set({ running: false })
  },

  runCycle: async () => {
    const metrics = await runPlanetaryCycle()

    set({
      lastCycleAt: new Date().toISOString(),
      cyclesExecuted: get().cyclesExecuted + 1,
      lastMetrics: metrics
    })
  }
}))
