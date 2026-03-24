"use client"

import { useEffect, useState } from "react"
import AcademyV10Summary from "@/components/academy-v10/AcademyV10Summary"
import AcademyV10Ventures from "@/components/academy-v10/AcademyV10Ventures"

export default function AcademyV10Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v10/dashboard")
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
    await fetch("/api/academy-v10/orchestrate/run", { method: "POST" })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V10</p><h1 className="mt-2 text-4xl font-semibold">Autonomous Venture Network</h1></div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={run}>Run V10 Venture Network</button>
        {data && <>
          <AcademyV10Summary data={data} />
          <AcademyV10Ventures rows={data.rows} />
        </>}
      </div>
    </main>
  )
}
