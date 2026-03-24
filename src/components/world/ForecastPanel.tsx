'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useForecastingStore } from '../../stores/forecastingStore';

export default function ForecastPanel() {
  const agentForecasts = useForecastingStore((s) => s.agentForecasts);
  const districtForecasts = useForecastingStore((s) => s.districtForecasts);
  const treasuryExposure = useForecastingStore((s) => s.treasuryExposure);
  const refreshForecasts = useForecastingStore((s) => s.refreshForecasts);

  return (
    <div className={`absolute left-[750px] top-24 z-30 w-[360px] ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className="flex items-center justify-between">
        <div className={worldTheme.sectionLabel}>
          Institutional Forecasting
        </div>
        <WorldButton
          onClick={refreshForecasts}
          variant="ghost" size="sm"
        >
          Refresh
        </WorldButton>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          Treasury Exposure
        </div>
        {treasuryExposure ? (
          <div className="mt-2 space-y-1 text-sm text-white/70">
            <div>Held: $${treasuryExposure.estimatedHeldAmount}</div>
            <div>Released: $${treasuryExposure.estimatedReleasedAmount}</div>
            <div>Quarantine Risk: {treasuryExposure.estimatedQuarantineRisk}%</div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-white/50">No forecast yet.</div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          Highest Agent Risk
        </div>
        <div className="mt-2 space-y-2">
          {agentForecasts.slice(0, 3).map((forecast) => (
            <div key={forecast.agentId} className="text-sm text-white/70">
              {forecast.agentName}: {forecast.riskScore} ({forecast.riskLevel})
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          Highest District Risk
        </div>
        <div className="mt-2 space-y-2">
          {districtForecasts.slice(0, 3).map((forecast) => (
            <div key={forecast.district} className="text-sm text-white/70 capitalize">
              {forecast.district}: {forecast.riskScore} ({forecast.riskLevel})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
