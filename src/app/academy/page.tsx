"use client"

import { useEffect, useState } from "react"
import AgentTable from "@/components/academy/AgentTable"
import QueuePanels from "@/components/academy/QueuePanels"
import { domainRegistry, getDomainContract } from "@/contracts/registry"
import { DomainContract } from "@/contracts/types"
import DomainMetricsPanel from "@/components/hud/DomainMetricsPanel"
import DomainCasesPanel from "@/components/hud/DomainCasesPanel"
import DomainStatusBadge from "@/components/hud/DomainStatusBadge"

export default function AcademyPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>("governance")
  const [contract, setContract] = useState<DomainContract | null>(null)

  const load = async () => {
    try {
      const res = await fetch("/api/monitoring/dashboard")
      const json = await res.json()
      if (json.status === "success") {
        setData(json.result)
      }
    } catch (e) {
      console.error("Failed to load dashboard state", e)
    }
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Contract Refresh logic
    const updateContract = () => {
        const c = getDomainContract(selectedDomain);
        setContract(c);
    };
    updateContract();
    const timer = setInterval(updateContract, 1000);
    return () => clearInterval(timer);
  }, [selectedDomain]);

  const call = async (url: string, body?: any) => {
    setLoading(true)
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      })
      await load()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-8 text-white font-sans">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
               <p className="text-[10px] uppercase tracking-[0.6em] font-black text-cyan-500">AutoBots Master System v41.0</p>
            </div>
            <h1 className="mt-4 text-6xl font-black tracking-tighter uppercase italic leading-none">Stewardship Console</h1>
          </div>
          
          {data?.school && (
             <div className="rounded-[2.5rem] border border-white/5 bg-white/2 backdrop-blur-2xl p-10 text-right transition-all hover:bg-white/5 shadow-2xl">
              <div className="text-[10px] uppercase font-black tracking-[0.4em] text-neutral-500 mb-2">Omniversal Runtime</div>
              <div className={`text-4xl font-black tracking-tighter ${data.school.live ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.school.mode.toUpperCase()} {data.school.live ? "● LIVE" : "○ HALTED"}
              </div>
            </div>
          )}
        </header>

        {/* Global Contract Inspector */}
        <section className="space-y-8 p-12 rounded-[5rem] border border-white/5 bg-white/1 shadow-inner relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none transform group-hover:rotate-12 duration-1000">
                <span className="text-[150px] font-black italic serif select-none">C</span>
            </div>
            
            <div className="flex justify-between items-end mb-12 relative z-10 border-b border-white/5 pb-10">
                <div>
                   <h2 className="text-[10px] uppercase font-black tracking-[1em] text-neutral-600 mb-4 italic leading-none underline decoration-cyan-500/20 underline-offset-8">Intelligence Fabric Inspector</h2>
                   <div className="flex gap-4 mt-6">
                      {Object.keys(domainRegistry).map(domain => (
                          <button 
                            key={domain}
                            onClick={() => setSelectedDomain(domain)}
                            className={`px-10 py-4 rounded-full text-[10px] uppercase font-black tracking-[0.4em] transition-all italic border-2 ${
                                selectedDomain === domain 
                                ? 'bg-white text-black border-white shadow-2xl scale-105' 
                                : 'bg-transparent text-white/30 border-white/5 hover:border-white/20'
                            }`}
                          >
                            {domain}
                          </button>
                      ))}
                   </div>
                </div>
                {contract && (
                   <DomainStatusBadge status={contract.status} theme={contract.theme} size="lg" />
                )}
            </div>

            {contract ? (
                <div className="space-y-16 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                   <div>
                        <h4 className="text-[10px] uppercase font-black tracking-[0.8em] text-white/10 mb-8 italic">Metric Telemetry</h4>
                        <DomainMetricsPanel metrics={contract.metrics} theme={contract.theme} />
                   </div>
                   <div className="grid grid-cols-12 gap-16">
                        <div className="col-span-8">
                            <h4 className="text-[10px] uppercase font-black tracking-[0.8em] text-white/10 mb-8 italic">Registry Instances</h4>
                            <DomainCasesPanel cases={contract.cases} theme={contract.theme} />
                        </div>
                        <div className="col-span-4 p-10 rounded-[4.5rem] bg-black/40 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h4 className="text-[10px] uppercase font-black tracking-[0.5em] text-white/10 mb-6 italic">Domain Identity</h4>
                                <div className="text-4xl font-black text-white italic uppercase tracking-tighter">{contract.title}</div>
                                <p className="mt-4 text-xs text-white/30 italic leading-relaxed">System-wide parity maintained for intelligence layer {contract.domainId}.</p>
                            </div>
                            <div className="mt-12 text-[9px] uppercase font-black tracking-[0.4em] text-neutral-700 italic">
                                LAST_SYNC: {contract.lastUpdated ? new Date(contract.lastUpdated).toLocaleTimeString() : 'WAITING'}
                            </div>
                        </div>
                   </div>
                </div>
            ) : (
                <div className="py-24 text-center opacity-10">
                    <span className="text-[100px] font-black italic serif">?</span>
                    <div className="text-xs uppercase tracking-[0.5em] font-black italic mt-4">Telemetry Stream Dormant</div>
                </div>
            )}
        </section>

        {data && (
          <div className="space-y-16 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-[10px] uppercase font-black tracking-[1em] text-neutral-800 italic underline decoration-white/2 decoration-[8px] underline-offset-[12px]">Operational Subsystems</h2>
            
            <QueuePanels
              memoryCount={data.memoryCount}
              socialDraftCount={data.socialDraftCount}
              socialEditedCount={data.socialEditedCount}
              productionQueuedCount={data.productionQueuedCount}
              productionScheduledCount={data.productionScheduledCount}
              productionPostedCount={data.productionPostedCount}
              productionPostedCount2={data.productionPostedCount} // Fix for potential naming mismatch
              productionFailedCount={data.productionFailedCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
               <div className="lg:col-span-3">
                  <AgentTable agents={data.agents} />
               </div>
               <div className="lg:col-span-1 space-y-6">
                  <div className="rounded-[4rem] border border-white/5 bg-white/1 p-10 hover:bg-white/2 transition-all">
                    <h3 className="text-lg font-black uppercase tracking-widest italic mb-6">Health Matrix</h3>
                    <div className="space-y-10">
                       {[
                         { label: 'Learning Avg', val: data.avgLearningScore, color: 'cyan' },
                         { label: 'Perf Stability', val: data.avgPerformanceScore, color: 'emerald' }
                       ].map(stat => (
                        <div key={stat.label}>
                          <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.8em] italic mb-3">{stat.label}</div>
                          <div className={`text-5xl font-black text-${stat.color}-400 italic tracking-tighter leading-none`}>{(stat.val * 100).toFixed(1)}%</div>
                          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-${stat.color}-400 shadow-[0_0_10px_currentColor]`} style={{ width: `${stat.val * 100}%` }} />
                          </div>
                        </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
