"use client"

import { useEffect, useState } from "react"
import AcademyV7Summary from "@/components/academy-v7/AcademyV7Summary"
import AcademyV7Pipeline from "@/components/academy-v7/AcademyV7Pipeline"
import AcademyV7Validation from "@/components/academy-v7/AcademyV7Validation"

export default function AcademyV7Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v7/dashboard")
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
    await fetch("/api/academy-v7/orchestrate/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conceptId: "concept-demo-v7", category: "ai", title: "AI Marketplace Bot Prototype" }),
    })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V7</p>
          <h1 className="mt-2 text-4xl font-semibold">Prototype Execution</h1>
        </div>

        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={run}>
          Run V7 Prototype Pipeline
        </button>

        {data && (
          <>
            <AcademyV7Summary data={data} />
            <div className="grid gap-6 xl:grid-cols-2">
              <AcademyV7Pipeline rows={data.rows} />
              <AcademyV7Validation rows={data.rows} />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
