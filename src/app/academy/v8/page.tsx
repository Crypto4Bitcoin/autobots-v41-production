"use client"

import { useEffect, useState } from "react"
import AcademyV8Summary from "@/components/academy-v8/AcademyV8Summary"
import AcademyV8Products from "@/components/academy-v8/AcademyV8Products"

export default function AcademyV8Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v8/dashboard")
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
    await fetch("/api/academy-v8/orchestrate/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prototypeId: "proto-v8-demo", title: "AI Marketplace Bot Product", category: "ai", prototypeScore: 0.84 }),
    })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V8</p><h1 className="mt-2 text-4xl font-semibold">Marketplace Bot Factory</h1></div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={run}>Run V8 Product Factory</button>
        {data && <>
          <AcademyV8Summary data={data} />
          <AcademyV8Products rows={data.rows} />
        </>}
      </div>
    </main>
  )
}
