
export function AcademyV5Summary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Federated Schools</h3>
        <p className="text-2xl font-mono text-cyan-400 font-bold">12</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Marketplace Assets</h3>
        <p className="text-2xl font-mono text-purple-400 font-bold">142</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Active Trust Links</h3>
        <p className="text-2xl font-mono text-green-400 font-bold">48</p>
      </div>
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg shadow-xl">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Network ROI</h3>
        <p className="text-2xl font-mono text-amber-400 font-bold">8.4x</p>
      </div>
    </div>
  )
}
