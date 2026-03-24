'use client';
import WorldButton from './ui/WorldButton';
import { worldTheme } from '../../lib/world/theme';

import { useMemo, useState } from 'react';
import { useWorldStore } from '../../stores/worldStore';
import { useProgressionStore } from '../../stores/progressionStore';
import {
  canUnlockSkill,
  getProgressionSnapshot,
  getSkillsForRole,
} from '../../lib/progression/progressionEngine';

export default function SkillPanel() {
  const selectedAgentId = useWorldStore((s) => s.selectedAgentId);
  const agents = useWorldStore((s) => s.agents);
  const skills = useProgressionStore((s) => s.skills);
  const unlockSkillForAgent = useProgressionStore((s) => s.unlockSkillForAgent);
  const setAgentPath = useProgressionStore((s) => s.setAgentPath);
  const grantXpToAgent = useProgressionStore((s) => s.grantXpToAgent);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const agent = agents.find((item) => item.id === selectedAgentId);

    const roleSkills = useMemo(() => {
    if (!agent || typeof agent.role !== 'string') return [];
    return getSkillsForRole(agent.role, skills);
  }, [agent, skills]);

  if (!agent) {
    return (
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/50">
        Select an agent to view progression.
      </div>
    );
  }

  const snapshot = getProgressionSnapshot(agent.level, agent.xp);

  return (
    <div className={`mt-5 ${worldTheme.panel} ${worldTheme.spacing.innerPadding} transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className={worldTheme.sectionLabel}>
          Skill Tree // v1.2
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-fuchsia-300/50 hover:text-fuchsia-300 transition-colors"
        >
          {isCollapsed ? '[ Expand ]' : '[ Collapse ]'}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <WorldButton
              onClick={() => setAgentPath(agent.id, 'leveling')}
              className={`rounded-xl border px-3 py-2 text-sm ${
                agent.path === 'leveling'
                  ? 'border-blue-400 bg-blue-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/65'
              }`}
            >
              Leveling
            </WorldButton>

            <WorldButton
              onClick={() => setAgentPath(agent.id, 'enterprise')}
              className={`rounded-xl border px-3 py-2 text-sm ${
                agent.path === 'enterprise'
                  ? 'border-amber-400 bg-amber-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/65'
              }`}
            >
              Enterprise
            </WorldButton>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
            <div className="flex items-center justify-between text-xs text-white/75">
              <span>XP Progress</span>
              <span className="font-mono">
                {snapshot.xp} / {snapshot.nextLevelXp}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-fuchsia-400/70"
                style={{ width: `${snapshot.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 max-h-[300px] space-y-3 overflow-y-auto pr-1">
            {roleSkills.map((skill) => {
              const unlocked = agent.unlockedSkillIds.includes(skill.id);
              const available = canUnlockSkill(agent, skill);

              return (
                <div
                  key={skill.id}
                  className={`rounded-xl border p-3 ${
                    unlocked
                      ? 'border-emerald-400/20 bg-emerald-500/10'
                      : available
                      ? 'border-blue-400/20 bg-blue-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white">{skill.label}</div>
                      <div className="mt-1 text-[10px] text-white/50">
                        Tier {skill.tier} • Level {skill.requiredLevel}+
                      </div>
                    </div>

                    <div className="text-[9px] uppercase tracking-[0.18em] text-white/50">
                      {unlocked ? 'Unlocked' : available ? 'Ready' : 'Locked'}
                    </div>
                  </div>

                  {!unlocked && available ? (
                    <WorldButton
                      onClick={() => unlockSkillForAgent(agent.id, skill.id)}
                      className="mt-3 w-full rounded-lg border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs text-white"
                    >
                      Unlock Skill
                    </WorldButton>
                  ) : unlocked && (
                    <div className="mt-2 text-[11px] text-white/65 italic leading-tight">
                       {skill.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="mt-2 flex items-center justify-between">
           <div className="text-xs text-white/60">
              {agent.name} • Lvl {agent.level}
           </div>
           <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-fuchsia-400/70"
                style={{ width: `${snapshot.progressPercent}%` }}
              />
            </div>
        </div>
      )}
    </div>
  );
}
