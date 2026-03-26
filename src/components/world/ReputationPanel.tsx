'use client';
import { worldTheme } from '../../lib/world/theme';

import { useWorldStore } from '../../stores/worldStore';
import { useReputationStore } from '../../stores/reputationStore';

export default function ReputationPanel() {
  const agents = useWorldStore((s) => s.agents);
  const districts = useWorldStore((s) => s.districts);
  const events = useReputationStore((s) => s.reputationEvents);

  return (
    <div className={`${worldTheme.panel} absolute left-[390px] top-24 z-30 w-[340px] p-4`.trim()}>
      <div className={`${worldTheme.sectionLabel} text-sky-300/80`.trim()}>
        Reputational Scoring
      </div>

      <div className={`${worldTheme.panel} mt-4`.trim()}>
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

      <div className={`${worldTheme.panel} mt-4`.trim()}>
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
