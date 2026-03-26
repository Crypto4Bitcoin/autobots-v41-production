'use client';
import { worldTheme } from '../../lib/world/theme';

import { useForecastingStore } from '../../stores/forecastingStore';

export default function RiskRadarPanel() {
  const signals = useForecastingStore((s) => s.preReviewSignals);

  return (
    <div className={`${worldTheme.panel} absolute left-[750px] bottom-24 z-30 w-[360px] p-4`.trim()}>
      <div className={`${worldTheme.sectionLabel} text-rose-300/80`.trim()}>
        Pre-Review Risk Radar
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {signals.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No active pre-review signals.
          </div>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className={`${worldTheme.panel} rounded-xl border border-rose-400/20 bg-rose-500/10 p-3`.trim()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{signal.label}</div>
                  <div className="mt-1 text-xs text-white/55 capitalize">
                    {signal.district}
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.18em] text-rose-200/80">
                  {signal.severity}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
