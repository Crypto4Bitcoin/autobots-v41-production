"use client"

import { useEffect, useState } from "react"
import AgentTable from "@/components/academy/AgentTable"
import QueuePanels from "@/components/academy/QueuePanels"

export default function AcademyPage() {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

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

  const call = async (url: string, body?: unknown) => {
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
    <main className="min-h-screen bg-neutral-950 p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
               <p className="text-xs uppercase tracking-[0.3em] font-bold text-cyan-500">AutoBots V2 Academy</p>
            </div>
            <h1 className="mt-2 text-5xl font-black tracking-tight">Stewardship Console</h1>
            <p className="mt-3 text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Orchestrate the 24/7 autonomous learning school. This score-driven factory prioritizes high-confidence research 
              and simulates content performance before production promotion.
            </p>
          </div>
          
          {data?.school && (
            <div className="rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-xl p-6 text-right transition-all">
              <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">Live School State</div>
              <div className={`text-2xl font-black ${data.school.live ? 'text-emerald-400' : 'text-red-400'}`}>
                {data.school.mode.toUpperCase()} {data.school.live ? "● ACTIVE" : "○ STOPPED"}
              </div>
              <div className="mt-2 text-[10px] text-neutral-600 font-mono">
                OVERSEEN BY: {data.school.overseenBy.length} STEWARDS
              </div>
            </div>
          )}
        </header>

        <section className="flex flex-wrap gap-3 p-1 rounded-xl bg-white/5 border border-white/5 w-fit">
          <button 
            disabled={loading}
            className="rounded-lg bg-emerald-500 px-6 py-2.5 text-black font-bold text-sm transition-all hover:bg-emerald-400 disabled:opacity-50" 
            onClick={() => call("/api/academy/live/start")}
          >
            Start Operations
          </button>
          <button 
            disabled={loading}
            className="rounded-lg bg-red-500/20 px-6 py-2.5 text-red-400 border border-red-500/30 font-bold text-sm transition-all hover:bg-red-500/30 disabled:opacity-50" 
            onClick={() => call("/api/academy/live/stop")}
          >
            Cease Ops
          </button>
          <div className="w-px h-8 bg-white/10 mx-2 self-center" />
          <button 
            disabled={loading}
            className="rounded-lg bg-white/10 px-6 py-2.5 text-white font-bold text-sm transition-all hover:bg-white/20 disabled:opacity-50" 
            onClick={() => call("/api/academy/rotate")}
          >
            Score-Based Rotation
          </button>
          <button 
            disabled={loading}
            className="rounded-lg bg-cyan-500/20 px-6 py-2.5 text-cyan-400 border border-cyan-500/30 font-bold text-sm transition-all hover:bg-cyan-500/30 disabled:opacity-50" 
            onClick={() => call("/api/academy/research", { agentId: "teacher-001" })}
          >
            Targeted Research (T-001)
          </button>
          <button 
            disabled={loading}
            className="rounded-lg bg-violet-500/20 px-6 py-2.5 text-violet-400 border border-violet-500/30 font-bold text-sm transition-all hover:bg-violet-500/30 disabled:opacity-50" 
            onClick={() => call("/api/content/build", { category: "ai" })}
          >
            Simulate AI Draft
          </button>
          <button 
            disabled={loading}
            className="rounded-lg bg-yellow-500/20 px-6 py-2.5 text-yellow-400 border border-yellow-500/30 font-bold text-sm transition-all hover:bg-yellow-500/30 disabled:opacity-50" 
            onClick={() => call("/api/autopost/queue")}
          >
            Priority Queue
          </button>
          <button 
            disabled={loading}
            className="rounded-lg bg-pink-500/20 px-6 py-2.5 text-pink-400 border border-pink-500/30 font-bold text-sm transition-all hover:bg-pink-500/30 disabled:opacity-50" 
            onClick={() => call("/api/autopost/publish")}
          >
            Publish Top
          </button>
        </section>

        {data && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <QueuePanels
              memoryCount={data.memoryCount}
              socialDraftCount={data.socialDraftCount}
              socialEditedCount={data.socialEditedCount}
              productionQueuedCount={data.productionQueuedCount}
              productionScheduledCount={data.productionScheduledCount}
              productionPostedCount={data.productionPostedCount}
              productionFailedCount={data.productionFailedCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
               <div className="lg:col-span-3">
                  <AgentTable agents={data.agents} />
               </div>
               <div className="lg:col-span-1 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
                    <h3 className="text-lg font-bold">System Health</h3>
                    <div className="mt-4 space-y-4">
                       <div>
                         <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Global Learning Avg</div>
                         <div className="text-2xl font-black text-cyan-400">{(data.avgLearningScore * 100).toFixed(1)}%</div>
                         <div className="mt-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-cyan-400" style={{ width: `${data.avgLearningScore * 100}%` }} />
                         </div>
                       </div>
                       <div>
                         <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Perf Stability</div>
                         <div className="text-2xl font-black text-emerald-400">{(data.avgPerformanceScore * 100).toFixed(1)}%</div>
                         <div className="mt-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400" style={{ width: `${data.avgPerformanceScore * 100}%` }} />
                         </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
                     <h3 className="text-lg font-bold">Latest Action</h3>
                     <p className="mt-1 text-xs text-neutral-500">{data.school?.lastGovernorActionAt ? new Date(data.school.lastGovernorActionAt).toLocaleString() : 'N/A'}</p>
                     <div className="mt-4 space-y-2">
                        {data.school?.overseenBy?.map((agent: string) => (
                           <div key={agent} className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase font-bold tracking-tighter bg-white/2 p-2 rounded">
                              <div className="h-1 w-1 rounded-full bg-emerald-500" />
                              {agent}
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
