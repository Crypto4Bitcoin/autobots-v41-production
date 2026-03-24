import { create } from 'zustand';
import type {
  AgentRiskForecast,
  DistrictRiskForecast,
  ForecastingState,
  PreReviewSignal,
  TreasuryExposureForecast,
} from '../lib/forecasting/types';
import {
  forecastAgentRisk,
  forecastDistrictRisk,
  forecastTreasuryExposure,
} from '../lib/forecasting/forecastingEngine';
import { useWorldStore } from './worldStore';
import { usePenaltyStore } from './penaltyStore';
import { usePolicyStore } from './policyStore';
import { shouldLockDistrict } from '../lib/policy/policyEngine';

interface ForecastingStore extends ForecastingState {
  refreshForecasts: () => void;
  addPreReviewSignal: (input: {
    taskId: string;
    agentId: string | null;
    district: PreReviewSignal['district'];
    label: string;
    severity: PreReviewSignal['severity'];
  }) => void;
  clearSignalsForTask: (taskId: string) => void;
}

export const useForecastingStore = create<ForecastingStore>((set) => ({
  agentForecasts: [],
  districtForecasts: [],
  treasuryExposure: null,
  preReviewSignals: [],

  refreshForecasts: () => {
    const world = useWorldStore.getState();
    const penalties = usePenaltyStore.getState().penalties;

    const agentForecasts: AgentRiskForecast[] = world.agents.map((agent) =>
      forecastAgentRisk(agent, penalties)
    );

    const districtForecasts: DistrictRiskForecast[] = world.districts.map((district) =>
      forecastDistrictRisk(district, penalties)
    );

    const compiledPolicy = usePolicyStore.getState().compiledPolicy;

    if (compiledPolicy) {
      districtForecasts.forEach((forecast) => {
        if (shouldLockDistrict(forecast.riskScore, compiledPolicy.districtLockThreshold)) {
          const district = world.districts.find((d) => d.id === forecast.district);

          if (district && district.restrictionLevel === 'open') {
            useWorldStore.setState({
              districts: world.districts.map((item) =>
                item.id === forecast.district
                  ? { ...item, restrictionLevel: 'restricted' as const }
                  : item
              ),
            });
          }
        }
      });
    }

    const averageTrustScore =
      world.agents.length > 0
        ? Math.round(
            world.agents.reduce((sum, agent) => sum + agent.trustScore, 0) /
              world.agents.length
          )
        : 75;

    const treasuryExposure: TreasuryExposureForecast = forecastTreasuryExposure({
      estimatedGross: 5000,
      averageTrustScore,
      openSignalCount: penalties.filter((p) => p.active).length,
    });

    set({
      agentForecasts,
      districtForecasts,
      treasuryExposure,
    });
  },

  addPreReviewSignal: (input) =>
    set((state) => ({
      preReviewSignals: [
        {
          id: `signal-${input.taskId}-${Date.now()}`,
          ...input,
          createdAt: Date.now(),
        },
        ...state.preReviewSignals,
      ],
    })),

  clearSignalsForTask: (taskId) =>
    set((state) => ({
      preReviewSignals: state.preReviewSignals.filter((signal) => signal.taskId !== taskId),
    })),
}));
