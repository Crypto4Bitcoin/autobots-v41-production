"use client"
import { useState } from "react"

export default function InterruptPanel() {
  const [result, setResult] = useState<unknown>(null)

  const sendInterrupt = async () => {
    const res = await fetch("/api/strategic/interrupt", { method: "POST" })
    const data = await res.json()
    setResult(data)
  }

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-rose-400 font-bold mb-2">Interrupt Priority Bus</h3>
      <button onClick={sendInterrupt} className="bg-rose-600 px-4 py-2 rounded text-white font-bold text-sm">Pause Evolution</button>
      {result && <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}