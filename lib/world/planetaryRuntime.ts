import { autoposterReleaseNext } from '@/lib/autobots-market'
import { useDefenseDistrictStore } from '@/stores/defenseDistrictStore'
import { useMetaOversightStore } from '@/stores/metaOversightStore'
import { useWorldKernelStore } from '@/stores/worldKernelStore'

function now() {
  return new Date().toISOString()
}

export async function runPlanetaryCycle() {
  const defense = useDefenseDistrictStore.getState()
  const citadel = useMetaOversightStore.getState()
  const kernel = useWorldKernelStore.getState()

  // MARKET CYCLE
  const marketRelease = autoposterReleaseNext()

  // DEFENSE HEALTH
  const breachCount = defense.cells.filter(c => c.status === 'breach').length

  if (breachCount > 0) {
    citadel.addAlert({
      title: 'Defense Breach Detected',
      severity: breachCount > 3 ? 'critical' : 'high',
      source: 'defense-grid',
      message: `${breachCount} cells reporting breach state`,
    })
  }

  // READINESS SCORE
  const readiness =
    Math.max(
      0,
      100
      - breachCount * 3
      - citadel.activeAlerts * 2
    )

  kernel.syncWorld()

  return {
    cycleTime: now(),
    releasedAssets: marketRelease.released.length,
    breaches: breachCount,
    alerts: citadel.activeAlerts,
    readiness
  }
}
