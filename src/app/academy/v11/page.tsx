"use client"

import { useEffect, useState } from "react"
import AcademyV11Summary from "@/components/academy-v11/AcademyV11Summary"
import AcademyV11Commons from "@/components/academy-v11/AcademyV11Commons"

export default function AcademyV11Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v11/dashboard")
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
    await fetch("/api/academy-v11/orchestrate/run", { method: "POST" })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V11</p><h1 className="mt-2 text-4xl font-semibold">Global Intelligence Commons</h1></div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={run}>Run V11 Commons</button>
        {data && <>
          <AcademyV11Summary data={data} />
          <AcademyV11Commons data={data} />
        </>}
      </div>
    </main>
  )
}
