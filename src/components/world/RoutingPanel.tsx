'use client';
import { worldTheme } from '../../lib/world/theme';

import { useSimulationStore } from '../../stores/simulationStore';

export default function RoutingPanel() {
  const decisions = useSimulationStore((s) => s.decisions);
  const latest = decisions[0];

  return (
    <div className="absolute left-[1120px] bottom-24 z-30 w-[360px] rounded-[24px] border border-teal-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-teal-300/80">
        Routing Board
      </div>

      {!latest ? (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
          No routing decisions available.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {latest.candidates.map((candidate) => (
            <div
              key={candidate.agentId}
              className={`rounded-xl border p-3 ${
                candidate.selected
                  ? 'border-teal-400/20 bg-teal-500/10'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">
                    {candidate.agentName}
                  </div>
                  <div className="mt-1 text-xs text-white/55">
                    Risk {candidate.projectedRisk} • Trust {candidate.trustScore}
                  </div>
                </div>
                <div className="text-right text-xs text-white/65">
                  <div>Pay $${candidate.projectedPayout}</div>
                  <div>Hold $${candidate.projectedHold}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
