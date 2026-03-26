'use client';

import React from 'react';
import { useWorldStore } from '@/stores/worldStore';
import { useAgentKernelStore } from '@/stores/agentKernelStore';
import { useGovernanceStore } from '@/stores/governanceStore';
import { usePenaltyStore } from '@/stores/penaltyStore';
import { useReputationStore } from '@/stores/reputationStore';
import { worldTheme } from '../../lib/world/theme';
import WorldButton from './ui/WorldButton';

export default function WorldMobileShell() {
  const worldName = useWorldStore((s) => s.worldName);
  const phaseLabel = useWorldStore((s) => s.phaseLabel);
  const market = useWorldStore((s) => s.market);
  const agents = useWorldStore((s) => s.agents);
  const districts = useWorldStore((s) => s.districts);
  const selectedDistrict = useWorldStore((s) => s.selectedDistrict);
  const setSelectedDistrict = useWorldStore((s) => s.setSelectedDistrict);
  const selectedAgentId = useWorldStore((s) => s.selectedAgentId);
  const setSelectedAgent = useWorldStore((s) => s.setSelectedAgent);

  const activeTasks = useAgentKernelStore((s) => s.activeTasks);
  const isRunning = useAgentKernelStore((s) => s.isRunning);
  const startSimulation = useAgentKernelStore((s) => s.startSimulation);
  const stopSimulation = useAgentKernelStore((s) => s.stopSimulation);
  const triggerTick = useAgentKernelStore((s) => s.triggerTick);
  const generateTask = useAgentKernelStore((s) => s.generateTask);

  const governanceCases = useGovernanceStore((s) => s.cases);
  const penalties = usePenaltyStore((s) => s.penalties);
  const treasuryHolds = useReputationStore((s) => s.treasuryHolds);

  const selectedDistrictData = districts.find((d) => d.id === selectedDistrict);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <main className="min-h-screen bg-black px-4 py-4 text-white pb-20">
      <div className="mx-auto max-w-md space-y-4">
        <section className={worldTheme.panel + " p-5"}>
          <div className={worldTheme.sectionLabel + " text-blue-300/80"}>
            {worldName}
          </div>
          <div className="mt-2 text-2xl font-semibold uppercase tracking-wider">Command Bridge</div>
          <div className="mt-1 text-sm text-white/55">{phaseLabel}</div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className={worldTheme.panel + " p-4"}>
            <div className={worldTheme.sectionLabel}>Market</div>
            <div className="mt-2 text-lg font-semibold">
              ${market.totalValue.toLocaleString()}
            </div>
          </div>
          <div className={worldTheme.panel + " p-4"}>
            <div className={worldTheme.sectionLabel}>Growth</div>
            <div className="mt-2 text-lg font-semibold">{market.growthRate}%</div>
          </div>
        </section>

        <section className={worldTheme.panel + " p-5"}>
          <div className={worldTheme.sectionLabel}>Districts</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {districts.map((district) => {
              const active = selectedDistrict === district.id;
              return (
                <button
                  key={district.id}
                  onClick={() => setSelectedDistrict(district.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition ${
                    active
                      ? 'border-blue-400/50 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="text-sm font-semibold tracking-wide">{district.label}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-white/45">
                    {district.restrictionLevel}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {selectedDistrictData ? (
          <section className={worldTheme.panelStrong + " p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"}>
            <div className={worldTheme.sectionLabel}>
              Selected District
            </div>
            <div className="mt-2 text-lg font-semibold text-blue-100">{selectedDistrictData.label}</div>
            <div className="mt-2 text-sm leading-relaxed text-white/60">
              {selectedDistrictData.description}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-blue-500/5 border border-white/5 p-2">
                <div className="text-[10px] uppercase tracking-wider text-white/45">Health</div>
                <div className="font-medium">{selectedDistrictData.health}%</div>
              </div>
              <div className="rounded-xl bg-blue-500/5 border border-white/5 p-2">
                <div className="text-[10px] uppercase tracking-wider text-white/45">Tax</div>
                <div className="font-medium">{selectedDistrictData.taxRate}%</div>
              </div>
              <div className="rounded-xl bg-blue-500/5 border border-white/5 p-2">
                <div className="text-[10px] uppercase tracking-wider text-white/45">Trust</div>
                <div className="font-medium">{selectedDistrictData.trustScore}</div>
              </div>
            </div>
          </section>
        ) : null}

        <section className={worldTheme.panel + " p-5"}>
          <div className="flex items-center justify-between mb-4">
            <div className={worldTheme.sectionLabel + " text-amber-300/80"}>
              Runtime Kernel
            </div>
            <WorldButton
              size="sm"
              variant={isRunning ? 'red' : 'emerald'}
              onClick={isRunning ? stopSimulation : startSimulation}
            >
              {isRunning ? 'Deactivate' : 'Activate'}
            </WorldButton>
          </div>

          <div className="flex gap-2">
            <WorldButton variant="ghost" className="flex-1" onClick={triggerTick}>
              Delta-Tick
            </WorldButton>
            <WorldButton variant="ghost" className="flex-1" onClick={generateTask}>
              Inject Task
            </WorldButton>
          </div>

          <div className="mt-5 space-y-2">
            {activeTasks.length === 0 ? (
              <div className="rounded-xl bg-black/40 border border-white/5 p-4 text-center text-xs text-white/40 tracking-widest uppercase">
                Zero Tasks Active
              </div>
            ) : (
              activeTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="rounded-2xl bg-white/5 border border-white/5 p-3 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium">{task.description}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/45 mt-1">
                      {task.requiredRole} • Progress {task.progress}%
                    </div>
                  </div>
                  <div className="text-xs font-mono text-emerald-400">
                    +${task.payoutAmount}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={worldTheme.panel + " p-5"}>
          <div className={worldTheme.sectionLabel}>Operational Agents</div>
          <div className="mt-4 space-y-2">
            {agents.slice(0, 6).map((agent) => {
              const active = selectedAgentId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    active
                      ? 'border-fuchsia-400/50 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                      : 'border-white/10 bg-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-sm">{agent.name}</div>
                    <div className={`text-[10px] uppercase tracking-widest ${agent.status === 'working' ? 'text-emerald-400' : 'text-white/45'}`}>
                      {agent.status}
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-white/40 leading-relaxed">
                    {agent.role} <span className="mx-1 text-white/10">|</span> 
                    LVL {agent.level} <span className="mx-1 text-white/10">|</span> 
                    XP {agent.xp} <span className="mx-1 text-white/10">|</span> 
                    Trust {agent.trustScore}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <div className={worldTheme.panel + " p-4 text-center"}>
            <div className={worldTheme.sectionLabel}>Cases</div>
            <div className="mt-2 text-xl font-bold text-amber-400">{governanceCases.length}</div>
          </div>
          <div className={worldTheme.panel + " p-4 text-center"}>
            <div className={worldTheme.sectionLabel}>Alerts</div>
            <div className="mt-2 text-xl font-bold text-red-500">{penalties.filter((p) => p.active).length}</div>
          </div>
          <div className={worldTheme.panel + " p-4 text-center"}>
            <div className={worldTheme.sectionLabel}>Holds</div>
            <div className="mt-2 text-xl font-bold text-blue-400">{treasuryHolds.length}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
