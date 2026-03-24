
export function AcademyV6Concepts({ rows, title, borderColor }: { rows: unknown[], title: string, borderColor: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className={`p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 border-t-2 ${borderColor}`}>
        <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest italic">{title}</h2>
        <span className="text-[10px] text-slate-500 font-mono italic">REALTIME_FEDERATED_FEED</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-slate-500 uppercase bg-slate-950/30">
            <tr>
              <th className="px-4 py-3">Concept Bot</th>
              <th className="px-4 py-3 text-center">ROI</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-600 italic">No concept archives located.</td></tr>
            ) : rows.map((row: unknown) => (
              <tr key={row.id} className="hover:bg-slate-800/50 transition-colors group">
                <td className="px-4 py-3">
                  <div className="font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">{row.concept.title}</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">{row.concept.category}</div>
                </td>
                <td className="px-4 py-3 text-center font-mono text-amber-500">{(row.analytics.expectedROI * 10).toFixed(1)}x</td>
                <td className="px-4 py-3 text-center font-mono text-slate-400">{row.test.finalScore.toFixed(3)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase \${
                    row.archiveBucket === 'good_working' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {row.archiveBucket}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
