"use client"

import { useEffect, useState } from "react"
import AcademyV9Summary from "@/components/academy-v9/AcademyV9Summary"
import AcademyV9Allocation from "@/components/academy-v9/AcademyV9Allocation"

export default function AcademyV9Page() {
  const [data, setData] = useState<unknown>(null)

  const load = async () => {
    const res = await fetch("/api/academy-v9/dashboard")
    const json = await res.json()
    setData(json.result)
  }

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [])

  const seedRevenue = async () => {
    await fetch("/api/academy-v9/revenue/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "prod-v8-demo", schoolId: "school-001", revenue: 1800, cost: 620, period: "2026-Q1" }),
    })
    await fetch("/api/academy-v9/orchestrate/run", { method: "POST" })
    await load()
  }

  return (
    <main className="min-h-screen bg-neutral-950 p-6 text-white">
      <div className="mx-auto max-w-7xl space-y-6">
        <div><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Omega Academy V9</p><h1 className="mt-2 text-4xl font-semibold">Revenue Intelligence</h1></div>
        <button className="rounded bg-cyan-500 px-4 py-2 text-black" onClick={seedRevenue}>Seed Revenue + Run V9</button>
        {data && <>
          <AcademyV9Summary data={data} />
          <AcademyV9Allocation rows={data.allocations} />
        </>}
      </div>
    </main>
  )
}
