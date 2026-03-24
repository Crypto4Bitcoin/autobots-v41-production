'use client';
import { worldTheme } from '../../lib/world/theme';

import { useWorldStore } from '../../stores/worldStore';
import { useReputationStore } from '../../stores/reputationStore';

export default function ReputationPanel() {
  const agents = useWorldStore((s) => s.agents);
  const districts = useWorldStore((s) => s.districts);
  const events = useReputationStore((s) => s.reputationEvents);

  return (
    <div className="absolute left-[390px] top-24 z-30 w-[340px] rounded-[24px] border border-sky-400/15 bg-black/60 p-4 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.35em] text-sky-300/80">
        Reputational Scoring
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          Agent Trust
        </div>
        <div className="mt-2 space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center justify-between text-sm">
              <span className="text-white/70">{agent.name}</span>
              <span className="text-white">{agent.trustScore}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
        <div className="text-xs uppercase tracking-[0.2em] text-white/50">
          District Trust
        </div>
        <div className="mt-2 space-y-2">
          {districts.map((district) => (
            <div key={district.id} className="flex items-center justify-between text-sm">
              <span className="text-white/70">{district.label}</span>
              <span className="text-white">{district.trustScore}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 max-h-[180px] space-y-2 overflow-y-auto pr-1">
        {events.slice(0, 6).map((event) => (
          <div key={event.id} className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white/60">
            {event.targetType} {event.targetId}: {event.delta > 0 ? '+' : ''}
            {event.delta} · {event.reason}
          </div>
        ))}
      </div>
    </div>
  );
}
