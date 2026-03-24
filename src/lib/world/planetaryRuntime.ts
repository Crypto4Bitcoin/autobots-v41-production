import { autoposterReleaseNext } from '@/lib/autobots-market'
import { useDefenseDistrictStore } from '@/stores/defenseDistrictStore'
import { useMetaOversightStore } from '@/stores/metaOversightStore'
import { useWorldKernelStore } from '@/stores/worldKernelStore'
import { useSecurityReplayStore } from '@/stores/securityReplayStore'
import { useCountermeasureStore } from '@/stores/countermeasureStore'
import { useDistrictRelayStore } from '@/stores/districtRelayStore'
import { useCivilMarketBridgeStore } from '@/stores/civilMarketBridgeStore'
import { usePlanetaryReadinessStore } from '@/stores/planetaryReadinessStore'

function now() {
  return new Date().toISOString()
}

export async function runPlanetaryCycle() {
  const defense = useDefenseDistrictStore.getState()
  const citadel = useMetaOversightStore.getState()
  const kernel = useWorldKernelStore.getState()
  const relay = useDistrictRelayStore.getState()
  const bridge = useCivilMarketBridgeStore.getState()
  const readinessStore = usePlanetaryReadinessStore.getState()

  if (relay.links.length === 0) {
    relay.bootstrapRelayMesh()
  }

  const marketRelease = autoposterReleaseNext()

  const breachCount = defense.cells.filter(c => c.status === 'breach').length

  if (breachCount > 0) {
    citadel.addAlert({
      title: 'Defense Breach Detected',
      severity: breachCount > 3 ? 'critical' : 'high',
      source: 'defense-grid',
      message: `${breachCount} cells reporting breach state`,
    })
  }

  const routed = useCountermeasureStore.getState().autoRouteBreaches()

  if (marketRelease.released.length > 0 && relay.links[0]) {
    relay.sendSignal({
      linkId: relay.links[0].id,
      signalType: 'market',
      payloadSummary: `${marketRelease.released.length} market assets released.`,
    })
  }

  if (citadel.activeAlerts > 0 && relay.links[0]) {
    relay.sendSignal({
      linkId: relay.links[0].id,
      signalType: 'alert',
      payloadSummary: `${citadel.activeAlerts} active alerts in oversight.`,
    })
  }

  bridge.syncBridge()
  const readiness = readinessStore.recalculateReadiness()

  kernel.syncWorld()

  if (marketRelease.released.length > 0) {
    useSecurityReplayStore.getState().logEvent({
      domain: 'market',
      type: 'market_asset_released',
      payload: {
        count: marketRelease.released.length,
      },
    })
  }

  useSecurityReplayStore.getState().logEvent({
    domain: 'fabric',
    type: 'fabric_cycle_executed',
    payload: {
      releasedAssets: marketRelease.released.length,
      breaches: breachCount,
      alerts: citadel.activeAlerts,
      readiness,
      countermeasuresRouted: routed.length,
    },
  })

  return {
    cycleTime: now(),
    releasedAssets: marketRelease.released.length,
    breaches: breachCount,
    alerts: citadel.activeAlerts,
    readiness,
    countermeasuresRouted: routed.length,
    relaySignals: relay.signals.length,
    bridgeRecords: bridge.records.length,
  }
}