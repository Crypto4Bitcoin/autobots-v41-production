"use client"
import { useState } from "react"

export default function TradeoffPanel() {
  const [result, setResult] = useState<unknown>(null)

  const explain = async () => {
    const res = await fetch("/api/strategic/tradeoff", { method: "POST" })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-cyan-400 font-bold mb-2">Tradeoff Transparency</h3>
      <button onClick={explain} className="bg-cyan-600 px-4 py-2 rounded text-black font-bold text-sm">Explain Tradeoff</button>
      {result && <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}