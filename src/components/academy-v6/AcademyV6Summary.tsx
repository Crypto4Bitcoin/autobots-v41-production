
export function AcademyV6Summary({ data }: { data: unknown }) {
  const good = data?.goodCount || 0;
  const bad = data?.badCount || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Good Working Concepts</h3>
        <p className="text-4xl font-mono text-cyan-400 font-black">{good}</p>
        <p className="text-[10px] text-slate-500 mt-2">Concepts passing institutional viability & feasibility thresholds.</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-500/10 transition-all"></div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Bad Not Working</h3>
        <p className="text-4xl font-mono text-slate-500 font-black">{bad}</p>
        <p className="text-[10px] text-slate-500 mt-2">Innovation candidates archived due to low score or high risk.</p>
      </div>
    </div>
  )
}
