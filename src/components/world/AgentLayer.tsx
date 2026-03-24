'use client';
import { useWorldStore } from '../../stores/worldStore';

export default function AgentLayer() {
  const agents = useWorldStore((s) => s.agents);
  const setSelectedAgent = useWorldStore((s) => s.setSelectedAgent);

  return (
    <>
      {agents.map((agent) => (
        <button
          key={agent.id}
          onClick={() => setSelectedAgent(agent.id)}
          className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${agent.x}%`,
            top: `${agent.y}%`,
          }}
          title={`${agent.name} • ${agent.role}`}
        >
          <span className="block h-3 w-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.95)]" />
          <span className="mt-1 block whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-white/60">
            {agent.role}
          </span>
        </button>
      ))}
    </>
  );
}