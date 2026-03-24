"use client"
import { useState } from "react"

export default function ContainmentPanel() {
  const [result, setResult] = useState<unknown>(null)

  const containRegion = async () => {
    const res = await fetch("/api/strategic/containment", { method: "POST" })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-amber-400 font-bold mb-2">Regional Containment</h3>
      <button onClick={containRegion} className="bg-amber-600 px-4 py-2 rounded text-black font-bold text-sm">Contain Region</button>
      {result && <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}