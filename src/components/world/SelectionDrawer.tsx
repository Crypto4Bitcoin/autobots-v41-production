'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useWorldStore } from '../../stores/worldStore';
import SkillPanel from './SkillPanel';

export default function SelectionDrawer() {
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const selectedAgentId = useWorldStore((s) => s.selectedAgentId);
  const districts = useWorldStore((s) => s.districts);
  const agents = useWorldStore((s) => s.agents);
  const market = useWorldStore((s) => s.market);

  const district = districts.find((d) => d.id === selectedDistrict);
  const agent = agents.find((a) => a.id === selectedAgentId);

  return (
    <aside className={"mr-4 w-[320px] " + worldTheme.panel + " p-5"}>
      <div className={worldTheme.heading}>
        Influence Grid
      </div>

      {agent ? (
        <>
          <div className={"mt-5 " + worldTheme.panel + " p-4 rounded-2xl"}>
            <div className={worldTheme.sectionLabel}>
              Selected Agent
            </div>
            <div className="mt-2 text-xl font-semibold text-white">{agent.name}</div>
            <div className="mt-2 text-sm text-white/60">
              {agent.role} • {agent.district}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Level
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{agent.level}</div>
            </div>

            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                XP
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{agent.xp}</div>
            </div>

            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Wallet
              </div>
              <div className="mt-2 text-lg font-semibold text-white">
                ${agent.money.toLocaleString()}
              </div>
            </div>

            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Path
              </div>
              <div className="mt-2 text-lg font-semibold capitalize text-white">
                {agent.path}
              </div>
            </div>
          </div>

          <SkillPanel />
        </>
      ) : district ? (
        <>
          <div className={"mt-5 " + worldTheme.panel + " p-4 rounded-2xl"}>
            <div className={worldTheme.sectionLabel}>
              Selected District
            </div>
            <div className="mt-2 text-xl font-semibold text-white">{district.label}</div>
            <div className="mt-2 text-sm text-white/60">{district.description}</div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Health
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{district.health}%</div>
            </div>

            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Energy
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{district.energy}%</div>
            </div>

            <div className={"rounded-2xl border border-white/10 bg-white/5 p-4"}>
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                Tax Rate
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{district.taxRate}%</div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-6 text-sm text-white/50">No selection active.</div>
      )}

      <div className={"mt-5 " + worldTheme.panel + " border-emerald-400/20 bg-emerald-500/10 p-4 rounded-2xl"}>
        <div className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/75">
          Live Market Feed
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-xs text-white/45">Active Agents</div>
            <div className="text-xl font-bold text-white">
              {market.activeAgents.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/45">Growth</div>
            <div className="text-xl font-bold text-white">{market.growthRate}%</div>
          </div>
        </div>
      </div>
    </aside>
  );
}