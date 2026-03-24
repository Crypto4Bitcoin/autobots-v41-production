"use client"
import { useState } from "react"

export default function SimulationPanel() {
  const [result, setResult] = useState<unknown>(null)

  const simulate = async () => {
    const res = await fetch("/api/strategic/simulate", { method: "POST" })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-purple-400 font-bold mb-2">Strategic Objective Simulator</h3>
      <button onClick={simulate} className="bg-purple-600 px-4 py-2 rounded text-white font-bold text-sm">Run Simulation</button>
      {result && <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}