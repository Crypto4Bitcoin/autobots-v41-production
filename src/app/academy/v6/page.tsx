
"use client"

import { useEffect, useState } from "react"
import { AcademyV6Summary } from "@/components/academy-v6/AcademyV6Summary"
import { AcademyV6Concepts } from "@/components/academy-v6/AcademyV6Concepts"
import { AcademyV6Archive } from "@/components/academy-v6/AcademyV6Archive"

export default function AcademyV6Page() {
  const [data, setData] = useState<unknown>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try {
      const res = await fetch("/api/academy-v6/dashboard")
      const json = await res.json()
      setData(json.result)
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [])

  const runV6 = async (category: string) => {
    setLoading(true)
    try {
      await fetch("/api/academy-v6/orchestrate/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
      })
      await load()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-white font-black text-xs italic">V6</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-widest uppercase italic">Market Creation Intelligence</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Research to Innovation Layer</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-emerald-500 text-[10px] font-bold animate-pulse">● LIVE_INNOVATION_SYNC</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Controls */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <div className="text-9xl font-black italic">OMEGA</div>
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Innovation Pipeline Trigger</h2>
          <div className="flex flex-wrap gap-4 relative z-10">
            {['ai', 'crypto', 'markets', 'automation'].map(cat => (
              <button 
                key={cat}
                disabled={loading}
                onClick={() => runV6(cat)}
                className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-700 hover:border-cyan-500 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                Synthesize {cat} Bot
              </button>
            ))}
          </div>
        </section>

        {data && (
          <>
            <AcademyV6Summary data={data} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AcademyV6Concepts rows={data.recentGood} title="Verified Innovation Loop" borderColor="border-t-cyan-500" />
              <AcademyV6Concepts rows={data.recentBad} title="Archived Risk Candidates" borderColor="border-t-slate-700" />
            </div>
            <AcademyV6Archive archive={[...data.recentGood, ...data.recentBad]} />
          </>
        )}
      </main>
    </div>
  )
}
