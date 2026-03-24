"use client"

import { useEffect, useState } from "react"
import AcademyV12Summary from "@/components/academy-v12/AcademyV12Summary"

export default function AcademyV12Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v12/dashboard")
    const json = await res.json()
    setData(json.result)
  }

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [])

  const run = async () => {
    await fetch("/api/academy-v12/orchestrate/run", { method: "POST" })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V12</p><h1 className="mt-2 text-4xl font-semibold">Constitutional Civilization Platform</h1></div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={run}>Run V12 Governance</button>
        {data && <>
          <AcademyV12Summary data={data} />
          <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4"> <h2 className="mb-4 text-xl font-semibold">Stability & Impact</h2> <pre className="overflow-auto text-xs text-neutral-300">{JSON.stringify(data, null, 2)}</pre> </section>
        </>}
      </div>
    </main>
  )
}
