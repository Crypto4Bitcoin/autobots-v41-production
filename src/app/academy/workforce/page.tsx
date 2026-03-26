'use client';

import React from 'react';
import { useWorkforceStore } from '@/stores/workforceStore';
import { useEconomyStore } from '@/stores/economyStore';
import { worldTheme } from '@/lib/world/theme';
import WorldButton from '@/components/world/ui/WorldButton';

export default function WorkforcePage() {
  const { agents, jobs, totalValueGenerated, executeJob, optimizeAgents } = useWorkforceStore();
  const { sovereignCredits, irsPulses } = useEconomyStore();

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b border-emerald-900 pb-6">
        <div>
          <h1 className={worldTheme.heading + " text-emerald-400"}>WORKFORCE</h1>
          <p className={worldTheme.sectionLabel + " text-emerald-700"}>Execution Layer // Value Generator</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-emerald-900 mb-1 font-bold tracking-widest uppercase">Global Output</div>
          <div className="text-6xl font-black text-emerald-500 tabular-nums">
            {totalValueGenerated}¢
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Agents */}
        <div className="col-span-4 space-y-6">
          <h2 className="text-xs font-bold text-emerald-800 tracking-tighter uppercase mb-4 px-4">Master Agent Registry</h2>
          {agents.map((agent) => (
            <div key={agent.id} className={worldTheme.panel + " border-emerald-900 group"}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-emerald-700 font-bold mb-1 opacity-50">{agent.id}</div>
                  <div className="text-lg font-bold text-emerald-200 group-hover:text-emerald-400 transition-colors uppercase italic">{agent.name}</div>
                </div>
                <div className={`px-3 py-1 text-[10px] font-black rounded-full ${
                  agent.status === 'idle' ? 'bg-emerald-950 text-emerald-600' : 'bg-emerald-500 text-black animate-pulse'
                }`}>
                  {agent.status.toUpperCase()}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-xs text-emerald-800 uppercase font-black">{agent.role} ARCHITECT</div>
                <div className="h-1 bg-emerald-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${agent.efficiency}%` }}
                  />
                </div>
                <div className="text-[10px] text-emerald-600 flex justify-between">
                  <span>EFFICIENCY: %{agent.efficiency}</span>
                  <span>SYNC: STABLE</span>
                </div>
              </div>
            </div>
          ))}
          
          <WorldButton 
            className="w-full mt-4 !bg-emerald-500 !text-black !font-black !py-4"
            onClick={optimizeAgents}
          >
            OPTIMIZE COLLECTIVE EFFICIENCY
          </WorldButton>
        </div>

        {/* Right Column: Execution Mesh */}
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-8 mb-8">
             <div className={worldTheme.panel + " border-emerald-900 !bg-emerald-950/20"}>
                <div className="text-xs text-emerald-800 font-black mb-2 tracking-widest uppercase italic">Economy Link</div>
                <div className="text-4xl font-black text-emerald-400 tabular-nums">{sovereignCredits}¢</div>
                <div className="text-[10px] text-emerald-700 mt-1 uppercase">Sovereign Credits Live Balance</div>
             </div>
             <div className={worldTheme.panel + " border-emerald-900 !bg-emerald-950/20"}>
                <div className="text-xs text-emerald-800 font-black mb-2 tracking-widest uppercase italic">Pulse Feed</div>
                <div className="text-4xl font-black text-emerald-400 tabular-nums">{irsPulses.length}</div>
                <div className="text-[10px] text-emerald-700 mt-1 uppercase">Active Economy Pulses Registered</div>
             </div>
          </div>

          <h2 className="text-xs font-bold text-emerald-800 tracking-tighter uppercase mb-6 px-4">Job Execution Mesh</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className={`p-6 border flex items-center justify-between transition-all ${
                job.status === 'complete' 
                ? 'bg-emerald-900/10 border-emerald-900 grayscale pointer-events-none' 
                : 'bg-emerald-950/40 border-emerald-800 hover:border-emerald-500'
              }`}>
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center font-black rounded ${
                    job.status === 'complete' ? 'bg-emerald-900 text-emerald-950' : 'bg-emerald-500 text-black'
                  }`}>
                    {job.id.substr(2)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-100 uppercase italic leading-none mb-1">{job.title}</div>
                    <div className="flex gap-4">
                       <span className="text-[10px] text-emerald-700 uppercase font-black tracking-widest">{job.role}</span>
                       <span className="text-[10px] text-emerald-400 font-bold tracking-widest">{job.value}¢ POTENTIAL</span>
                    </div>
                  </div>
                </div>
                
                <WorldButton 
                   disabled={job.status === 'complete'}
                   variant={job.status === 'complete' ? 'ghost' : 'action'}
                   className={job.status === 'complete' ? '!opacity-20' : '!border-emerald-500 !text-emerald-500'}
                   onClick={() => executeJob(job.id)}
                >
                  {job.status === 'complete' ? 'COMPLETE' : 'EXECUTE'}
                </WorldButton>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 border border-emerald-950 bg-emerald-950/5">
             <div className="text-xs text-emerald-800 font-black mb-4 uppercase tracking-[0.5em] text-center italic">Value Matrix // Intelligence Continuity</div>
             <div className="grid grid-cols-4 gap-4 opacity-30 italic">
                {irsPulses.slice(0, 8).map(pulse => (
                  <div key={pulse.id} className="text-[9px] text-emerald-500 overflow-hidden whitespace-nowrap">
                    [{pulse.timestamp.split('T')[1].substr(0, 8)}] PULSE: {pulse.type} :: {pulse.value}¢
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
