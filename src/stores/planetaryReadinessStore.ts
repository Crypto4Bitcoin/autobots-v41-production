import { create } from 'zustand';
import { useDefenseDistrictStore } from '@/stores/defenseDistrictStore';
import { useMetaOversightStore } from '@/stores/metaOversightStore';
import { useDistrictRelayStore } from '@/stores/districtRelayStore';
import { useCivilMarketBridgeStore } from '@/stores/civilMarketBridgeStore';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

type PlanetaryReadinessState = {
  score: number;
  defenseScore: number;
  oversightScore: number;
  relayScore: number;
  bridgeScore: number;
  calculatedAt: string | null;
};

type PlanetaryReadinessActions = {
  recalculateReadiness: () => number;
};

type PlanetaryReadinessStore = PlanetaryReadinessState & PlanetaryReadinessActions;

export const usePlanetaryReadinessStore = create<PlanetaryReadinessStore>((set) => ({
  score: 0,
  defenseScore: 0,
  oversightScore: 0,
  relayScore: 0,
  bridgeScore: 0,
  calculatedAt: null,

  recalculateReadiness: () => {
    const defense = useDefenseDistrictStore.getState();
    const oversight = useMetaOversightStore.getState();
    const relay = useDistrictRelayStore.getState();
    const bridge = useCivilMarketBridgeStore.getState();

    const defenseScore = Math.max(0, 100 - defense.breachCount * 10);
    const oversightScore = Math.max(0, oversight.governanceScore - oversight.activeAlerts * 2);
    const relayScore = relay.links.length === 0
      ? 0
      : Math.floor(
          (relay.links.filter((x) => x.status === 'active').length / relay.links.length) * 100
        );
    const bridgeScore = Math.min(100, bridge.records.length * 10);

    const score = Math.floor(
      defenseScore * 0.4 +
      oversightScore * 0.3 +
      relayScore * 0.2 +
      bridgeScore * 0.1
    );

    set({
      score,
      defenseScore,
      oversightScore,
      relayScore,
      bridgeScore,
      calculatedAt: new Date().toISOString(),
    });

    useSecurityReplayStore.getState().logEvent({
      domain: 'kernel',
      type: 'readiness_recalculated',
      payload: {
        score,
        defenseScore,
        oversightScore,
        relayScore,
        bridgeScore,
      },
    });

    return score;
  },
}));