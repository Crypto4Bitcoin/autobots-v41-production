"use client"
import { useEffect, useState } from "react"

export default function LedgerPanel() {
  const [entries, setEntries] = useState<unknown[]>([])

  const loadLedger = async () => {
    const res = await fetch("/api/strategic/ledger")
    const data = await res.json()
    setEntries(data.entries || [])
  }

  useEffect(() => {
// eslint-disable-next-line react-hooks/set-state-in-effect
    loadLedger()
  }, [])

  return (
    <div className="p-4 border rounded mb-4 bg-gray-900/40 border-gray-800">
      <h3 className="text-gray-400 font-bold mb-2">Unified Decision Ledger</h3>
      <button onClick={loadLedger} className="bg-gray-600 px-4 py-2 rounded text-white font-bold text-sm">Refresh</button>
      <pre className="mt-4 p-4 bg-black rounded text-[10px] overflow-auto">{JSON.stringify(entries, null, 2)}</pre>
    </div>
  )
}