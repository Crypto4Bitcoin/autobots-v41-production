'use client';
import { worldTheme } from '../../lib/world/theme';

import { useForecastingStore } from '../../stores/forecastingStore';

export default function RiskRadarPanel() {
  const signals = useForecastingStore((s) => s.preReviewSignals);

  return (
    <div className="absolute left-[750px] bottom-24 z-30 w-[360px] rounded-[24px] border border-rose-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-rose-300/80">
        Pre-Review Risk Radar
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {signals.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No active pre-review signals.
          </div>
        ) : (
          signals.map((signal) => (
            <div
              key={signal.id}
              className="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3"
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
