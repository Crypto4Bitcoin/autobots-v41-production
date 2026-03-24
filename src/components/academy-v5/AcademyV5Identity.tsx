
export function AcademyV5Identity() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <h2 className="text-sm font-bold text-slate-200">Verifiable Identity (DID)</h2>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-black/40 p-3 rounded border border-slate-800/50 font-mono text-[10px]">
          <p className="text-slate-500">did:omega-academy:school-001</p>
          <p className="text-emerald-500 mt-1">STATUS: VERIFIED // CREDENTIAL: STRATEGIC_PARTNER</p>
        </div>
      </div>
    </div>
  )
}
