"use client"
import { useEffect, useState } from "react"

export default function IntentPanel() {
  const [intents, setIntents] = useState<unknown[]>([])

  useEffect(() => {
    fetch("/api/strategic/intent")
      .then(r => r.json())
      .then(d => setIntents(d.intents || []))
  }, [])

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-blue-400 font-bold mb-2">Strategic Intent Registry</h3>
      <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(intents, null, 2)}</pre>
    </div>
  )
}