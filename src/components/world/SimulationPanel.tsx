'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';
import { useSimulationStore } from '../../stores/simulationStore';
import { useWorldStore } from '../../stores/worldStore';

export default function SimulationPanel() {
  const decisions = useSimulationStore((s) => s.decisions);
  const strategy = useSimulationStore((s) => s.strategy);
  const setStrategy = useSimulationStore((s) => s.setStrategy);
  const clearDecisions = useSimulationStore((s) => s.clearDecisions);
  const evolutionFitness = useWorldStore((s) => s.evolutionFitness);
  const realityDrift = useWorldStore((s) => s.realityDrift);
  const rpo = useWorldStore((s) => s.lastSnapshotRPO);

  return (
    <div className='absolute left-[1120px] top-24 z-30 w-[360px]'>
      <div className="flex items-center justify-between">
        <div className={worldTheme.sectionLabel}>
          Strategic Simulation
        </div>
        <WorldButton
          onClick={clearDecisions}
          variant="ghost" size="sm"
        >
          Clear
        </WorldButton>
      </div>

      <div className={`${worldTheme.panel} mt-4 p-3 bg-white/5 border border-white/10 rounded-xl`.trim()}>
        <div className="flex justify-between text-[10px] text-white/50 mb-1 uppercase tracking-wider">
          <span>Dimensional Integrity</span>
          <span>{Math.round(100 - realityDrift)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className='h-full transition-all duration-500'
            style={{ width: `${Math.max(0, 100 - realityDrift)}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
            <span className="text-[10px] text-white/40">Reality Drift: {realityDrift.toFixed(1)}</span>
            <span className="text-[10px] text-white/40">RPO: {rpo.toFixed(0)}s</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className={`${worldTheme.panel} p-3 bg-indigo-500/10 border border-indigo-400/20 rounded-xl`.trim()}>
            <div className="text-[10px] text-white/40 uppercase">Avg Fitness</div>
            <div className="text-lg font-bold text-white">{evolutionFitness}%</div>
        </div>
        <div className={`${worldTheme.panel} p-3 bg-white/5 border border-white/10 rounded-xl`.trim()}>
            <div className="text-[10px] text-white/40 uppercase">Active Shards</div>
            <div className="text-lg font-bold text-white tracking-widest">CORE-I</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {(['balanced', 'low_risk', 'max_yield'] as const).map((mode) => (
          <WorldButton
            key={mode}
            onClick={() => setStrategy(mode)}
            className='rounded-lg border px-2 py-2 text-xs'
          >
            {mode}
          </WorldButton>
        ))}
      </div>

      <div className="mt-4 max-h-[220px] space-y-3 overflow-y-auto pr-1">
        {decisions.length === 0 ? (
          <div className={`${worldTheme.panel} text-sm text-white/50`.trim()}>
            No simulations yet.
          </div>
        ) : (
          decisions.map((decision, idx) => (
            <div
              key={`${decision.taskId}-${idx}`}
              className={`${worldTheme.panel} rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3`.trim()}
            >
              <div className={worldTheme.heading}>
                Task {decision.taskId}
              </div>
              <div className="mt-1 text-xs text-white/55">
                Selected: {decision.selectedAgentName ?? 'none'}
              </div>
              <div className="mt-1 text-xs text-white/55">
                Strategy: {decision.strategy}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
